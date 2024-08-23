/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    const { HAS_NODE, TITLE, CHEERIO_OPTIONS, MODULES_DIR, PREFS_PREFIX, NS, CONFIG, COMMAND, COMMAND_NAME, OPTIONS, STORAGE } = require("CONSTANTS");

    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    const NodeConnector = brackets.getModule("NodeConnector");
    const EditorManager = brackets.getModule("editor/EditorManager");
    const CommandManager = brackets.getModule("command/CommandManager");
    const Menus = brackets.getModule("command/Menus");
    const ProjectManager = brackets.getModule("project/ProjectManager");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const FileUtils = brackets.getModule("file/FileUtils");
    const PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    
    const Options = require("Options");
    const Code = require("Code");
    const UI = require("UI/UI");
    
    const phoenixExec = require("phoenixExec");
    const nodeConnector = HAS_NODE ? NodeConnector.createNodeConnector("mjerabek.cz.codebycode", require("CodeDialogs")): null;
    
    const prefs = PreferencesManager.getExtensionPrefs(PREFS_PREFIX);
    
    function getModulesPath() {
        return brackets.path.join(
            fs.getTauriPlatformPath(brackets.app.getApplicationSupportDirectory()),
            MODULES_DIR
        );
    }

    function saveLastExec(data) {
        data = {...data};
        delete data.output;
        localStorage.setItem(
            STORAGE.LAST_OPTIONS, 
            JSON.stringify(data)
        );

        if (!data.name?.trim()) return;
        let codeOrder = JSON.parse(localStorage.getItem(STORAGE.CODE_ORDER) ?? "[]");
        codeOrder = codeOrder.filter(name => name !== data.name);
        localStorage.setItem(
            STORAGE.CODE_ORDER,
            JSON.stringify([data.name, ...codeOrder].slice(0, 10))
        );
    }
    
    function getCONSTANTS(data, editor) {
        const isNodeEnv = data.env === OPTIONS.ENV_NODE;
        const projectDir = ProjectManager.getProjectRoot().fullPath;
        const PROJECT_DIR = isNodeEnv ? fs.getTauriPlatformPath(projectDir): projectDir;
        const fileDir = editor.document.file?.parentPath ?? "";
        const FILE_DIR = isNodeEnv ? fs.getTauriPlatformPath(fileDir): fileDir;
        const filePath = editor.document.file?.fullPath ?? "";
        const FILE_PATH = isNodeEnv ? fs.getTauriPlatformPath(filePath): filePath;
        const FILE_NAME = editor.document.file?.name ?? "";
        const selections = editor.getSelections();
        const mode = editor.document.language.getMode();
        const LANGUAGE = typeof mode === "object" ? mode.name: mode;
        const SELECTIONS = selections.map(selection => {
            const mode = editor.getModeForRange(selection.start, selection.end);
            return { 
                ...selection, 
                content: editor.document.getRange(selection.start, selection.end),
                language: typeof mode === "object" ? mode.name: mode
            };
        });
        return { PROJECT_DIR, FILE_DIR, FILE_PATH, FILE_NAME, SELECTIONS, LANGUAGE };
    }
    
    async function exec(data) {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return;
        if (!HAS_NODE && data.env === OPTIONS.ENV_NODE) {
            return UI.showError("Node.js is not available!");
        }
        
        saveLastExec(data);
        
        let abortedByUser = false;
        let edits = [];
        const outputStrings = [];
        const errors = [];
        try {
            UI.showWait(async () => {
                if (data.env === OPTIONS.ENV_NODE && HAS_NODE) {
                    nodeConnector.execPeer("abort");
                } else {
                    phoenixExec.abort();
                }
                abortedByUser = true;
            });

            const processID = Date.now();
            const selections = editor.getSelections();
            const CONSTANTS = getCONSTANTS(data, editor);
            edits = await selections.reduce(async (results, selection, index) => {
                results = await results;
                if (errors.length || abortedByUser) return results;

                CONSTANTS.CONTENT = editor.document.getRange(selection.start, selection.end);
                CONSTANTS.INDEX = index;
                CONSTANTS.SELECTION = CONSTANTS.SELECTIONS[index];
                CONSTANTS.LANGUAGE = CONSTANTS.SELECTIONS[index]?.language ?? CONSTANTS.LANGUAGE;
                CONSTANTS.COMMAND = data.output ? "output": "rewrite";

                const execOptions = [CONSTANTS, data.code, CHEERIO_OPTIONS(data), processID];
                const result = data.env === OPTIONS.ENV_NODE && HAS_NODE ? 
                    await nodeConnector.execPeer("exec", [...execOptions, getModulesPath()]):
                    await phoenixExec.exec(execOptions);

                if (result.error) {
                    errors.push(result.error);
                    return results;
                }
                selection.text = result.content;
                if (CONSTANTS.CONTENT !== result.content) {
                    results.push({ edit: selection });
                }
                if (result.string || data.output) {
                    outputStrings.push(result.string);
                }
                return results;
            }, []);
        } catch (error) {
            errors.push(error);
        }
        if (errors.length) {
            return UI.showError(errors.join(", "));
        }
        if (abortedByUser) {
            return UI.showError("Aborted by user!");
        }
        
        if (!data.output) {
            try {
                editor.document.doMultipleEdits(edits, NS + Date.now());
            } catch (error) {
                return UI.showError(error);
            }
        }

        UI.showSuccess();
        if (outputStrings?.length) {
            UI.showOutputs(outputStrings, data.groupOutput);
        }
    }
    
    async function execLast(showOptions = false, isOutputCmd = false) {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return;

        const options = JSON.parse(localStorage.getItem(STORAGE.LAST_OPTIONS));
        if (!options) return UI.showError("No code was found!");
        
        if (showOptions) {
            const newOptions = await UI.showOptionsBar(
                `${TITLE}: Execute Last | ${isOutputCmd ? "Get output options": "Rewrite options"}`,
                options,
                isOutputCmd
            );
            if (!newOptions) return UI.showCancelled();
            Object.assign(options, newOptions);
            saveLastExec(options);
        }
        options.output = isOutputCmd;
        await exec(options);
    }
    
    async function execQuick(isOutputCmd = false) {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return;

        const userInput = await UI.showQuickExec(
            `${TITLE}: ${isOutputCmd ? "Get output": "Rewrite"}`,
            isOutputCmd
        );
        if (!userInput) return UI.showCancelled();
        if (userInput.error) return UI.showError(userInput.error);
        
        if (userInput.showOptions) {
            const newOptions = await UI.showOptionsBar(
                `${TITLE}: ${userInput.options.name} | ${isOutputCmd ? "Get output options": "Rewrite options"}`,
                userInput.options,
                isOutputCmd
            );
            if (!newOptions) return UI.showCancelled();
            Object.assign(userInput.options, newOptions);
        }
        saveLastExec(userInput.options);
        userInput.options.output = isOutputCmd;
        await exec(userInput.options);
    }
    
    const menuAppearance = Options.get(CONFIG.MENU_APPEARANCE);
    const cmdsAsSubmenu = menuAppearance === OPTIONS.SUBMENU;
    
    CommandManager.register(
        COMMAND_NAME[COMMAND.OPEN_MAIN_UI](cmdsAsSubmenu),
        COMMAND.OPEN_MAIN_UI, 
        UI.openMain
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.EXEC_LAST],
        COMMAND.EXEC_LAST,
        () => execLast(false)
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.OUTPUT_LAST],
        COMMAND.OUTPUT_LAST,
        () => execLast(false, true)
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.EXEC_LAST_OPTIONS],
        COMMAND.EXEC_LAST_OPTIONS,
        () => execLast(true)
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.OUTPUT_LAST_OPTIONS],
        COMMAND.OUTPUT_LAST_OPTIONS,
        () => execLast(true, true)
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.QUICK_EXEC],
        COMMAND.QUICK_EXEC,
        () => execQuick()
    );
    CommandManager.register(
        COMMAND_NAME[COMMAND.QUICK_OUTPUT],
        COMMAND.QUICK_OUTPUT,
        () => execQuick(true)
    );
    
    function registerCodeCommand(item) {
        if (!item?.cmd || !item?.name) return;

        CommandManager.register(
            item.name,
            item.cmd,
            () => {
                const freshItem = Code.getGlobalItemByName(item.name);
                if (!freshItem) UI.showError("Code not found!");
                exec({
                    ...freshItem,
                    ...UI.getOptionsByCurrentSelection(),
                    groupOutput: false
                });
            }
        );
        CommandManager.get(item.cmd)?.setEnabled(true);
    }
    
    Code.onCommandCreated(registerCodeCommand);
    
    Code.getGlobal()
        .filter(item => !!item?.cmd)
        .forEach(registerCodeCommand);

    UI.onExec(exec);

    UI.addIcon({
        CTRL: COMMAND.EXEC_LAST,
        CTRL_SHIFT: COMMAND.OUTPUT_LAST,
        CTRL_ALT: COMMAND.EXEC_LAST_OPTIONS,
        CTRL_ALT_SHIFT: COMMAND.OUTPUT_LAST_OPTIONS,
        ALT: COMMAND.QUICK_EXEC,
        ALT_SHIFT: COMMAND.QUICK_OUTPUT,
    });

    const editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    let targetMenu = editMenu;
    if (cmdsAsSubmenu) {
        const subMenu = editMenu.addSubMenu(TITLE, NS + "__submenu");
        targetMenu = subMenu;
    }
    if (targetMenu === editMenu) {
        editMenu.addMenuDivider();
    }
    targetMenu.addMenuItem(COMMAND.OPEN_MAIN_UI);
    targetMenu.addMenuItem(COMMAND.EXEC_LAST);
    targetMenu.addMenuItem(COMMAND.OUTPUT_LAST);
    targetMenu.addMenuItem(COMMAND.EXEC_LAST_OPTIONS);
    targetMenu.addMenuItem(COMMAND.OUTPUT_LAST_OPTIONS);
    targetMenu.addMenuItem(COMMAND.QUICK_EXEC);
    targetMenu.addMenuItem(COMMAND.QUICK_OUTPUT);
    if (targetMenu === editMenu) {
        editMenu.addMenuDivider();
    }
});
