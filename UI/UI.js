/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    const { DEV, EXAMPLES_SOURCE, LOCAL_SOURCE, HAS_NODE, PREFS_PREFIX, NS, TITLE, CONFIG, OPTIONS, STORAGE } = require("CONSTANTS");
    const PANEL_MIN_HEIGHT = 400;
    
    const ID = {
        editorHolder: NS + "__editor-holder",
        clearSearch: NS + "__clear-search",
        listGlobal: NS + "__list-global",
        listLocal: NS + "__list-local",
        listExamples: NS + "__list-examples",
        localDir: NS + "__local-dir",
        close: NS + "__close",
        options: NS + "__options",
        help: NS + "__help",
        clear: NS + "__clear",
        save: NS + "__save",
        exec: NS + "__exec",
        output: NS + "__output"
    };
        
    const CLASS = {
        isActive: "is-active",
        noNode: "mj-codebycode-no-node",
        listWrapper: "mj-codebycode__list-wrapper",
        item: "mj-codebycode__item",
        listLink: "mj-codebycode__list-link",
        listShowActions: "mj-codebycode__list-show-actions",
        env: "mj-codebycode__environment",
        envInput: "mj-codebycode__environment-input",
        noContentMore: "mj-codebycode__no-content-more"
    };
    exports.CLASS = CLASS;

    const NAME = {
        name: "name",
        code: "code",
        search: "search",
        xml: "xml",
        env: "env",
        groupOutput: "groupOutput"
    };
    exports.NAME = NAME;

    const DATA = {
        action: "action",
        name: "name",
        env: "env",
        cmd: "cmd",
        source: "source"
    };

    const ATTR = {
        dataAction: "data-action",
        dataName: "data-name",
        dataEnv: "data-env",
        dataCmd: "data-cmd",
        dataSource: "data-source"
    };
    
    const TEMPLATE = {
        index: require("text!UI/index.html"),
        item: require("text!UI/item.html"),
        itemNoGlobal: require("text!UI/item-no-global.html"),
        itemNoLocal: require("text!UI/item-no-local.html")
    }; 
    
    const WorkspaceManager = brackets.getModule("view/WorkspaceManager");
    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    const ProjectManager = brackets.getModule("project/ProjectManager");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const EditorManager = brackets.getModule("editor/EditorManager");
    const Editor = brackets.getModule("editor/Editor");
    const CodeMirror = brackets.getModule("thirdparty/CodeMirror/lib/codemirror");
    const CommandManager = brackets.getModule("command/CommandManager");
    const KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    require("cheerio/browser");

    const Options = require("../Options");
    const Code = require("../Code");
    const Dialogs = require("./Dialogs");
    const Icon = require("./Icon");
    const OptionsBar = require("./OptionsBar");
    const QuickExec = require("./QuickExec");

    ExtensionUtils.loadStyleSheet(module, "styles.css");
    
    const $itemNoLocal = cheerio.load(TEMPLATE.itemNoLocal);
    $itemNoLocal(`#${ID.localDir}`).text(Options.get(CONFIG.CODE_LOCAL));
    TEMPLATE.itemNoLocal = $itemNoLocal.html();
    
    const _elementsById = {};
    const _elementsByName = {};
    const _onExecFns = [];
    
    let bottomPanel = null;
    let codeMirror = null;
    let $mainUI = null;
    let codeGlobal = [];
    
    function $id(id) {
        _elementsById[id] = _elementsById[id] ?? $mainUI?.find(`#${id}`);
        return _elementsById[id];
    }

    function $name(name) {
        _elementsByName[name] = _elementsByName[name] ?? $mainUI?.find(`[name="${name}"]`);
        return _elementsByName[name];
    }
    
    function getValueFromMain(name) {
        if (name === NAME.code) return codeMirror?.getValue() ?? "";
        return (new FormData($mainUI[0])).get(name);
    }

    function getOptionsFromMain() {
        return {
            name: getValueFromMain(NAME.name),
            code: getValueFromMain(NAME.code),
            env: getValueFromMain(NAME.env) ?? OPTIONS.ENV_PHOENIX,
            xml: getValueFromMain(NAME.xml) === "on",
            groupOutput: getValueFromMain(NAME.groupOutput) === "on"
        };
    }

    function initEditor() {
        const $editorHolder = $id(ID.editorHolder);
        codeMirror = new CodeMirror(
            $editorHolder[0], 
            {
                //configureMouse: (_cm, _repeat, event) => ({ addNew: event.altKey }),
                autoCloseBrackets: true,
                autoCloseTags: true,
                coverGutterNextToScrollbar: true,
                continueComments: true,
                cursorScrollMargin: 3,
                electricChars: true,
                highlightSelectionMatches: true,
                indentUnit: Options.get(CONFIG.INDENTATION),
                indentWithTabs: false,
                inputStyle: "textarea",
                lineNumbers: true,
                lineWiseCopyCut: true,
                lineWrapping: false,
                matchBrackets: { maxScanLineLength: 50000, maxScanLines: 1000 },
                matchTags: { bothTags: true },
                smartIndent: true,
                styleActiveLine: true,
                tabSize: Options.get(CONFIG.INDENTATION),
                readOnly: false,
                extraKeys: {
                    "Shift-Tab": "indentLess"
                },
                value: "",
                mode: "javascript"
            }
        );
        
        Options.onChange(CONFIG.INDENTATION, value => {
            codeMirror.setOption("tabSize", value);
            codeMirror.setOption("indentUnit", value);
        });
        
        if (DEV) (window.cm = codeMirror);
    }
    
    exports.getSearchResults = function getSearchResults(data, search, sortBySource = false) {
        if (!search) return data;

        const regex = new RegExp(search.replace(/[.*+?\^\${}()|\[\]\\]/g, "\\$&").replace(" ", ".*"), "gi");
        const searchCode = Options.get(CONFIG.SEARCH_CODE) === OPTIONS.YES;
        let result = data.map(item => {
            regex.lastIndex = 0;
            let rank = 0;
            
            const nameMatch = regex.exec(item.name);
            if (nameMatch) {
                rank = nameMatch.index;
                const strings = item.name.match(regex);
                if (strings) {
                    rank -= strings.join("").length;
                }
            } 

            let codeMatch;
            if (searchCode && !nameMatch && typeof item.code !== "undefined") {
                regex.lastIndex = 0;
                
                codeMatch = regex.exec(item.code);
                if (codeMatch) {
                    rank += 1000;
                    rank += codeMatch.index;
                    const strings = item.code.match(regex);
                    if (strings) {
                        rank -= strings.join("").length;
                    }
                }
            }
            
            if (sortBySource && item.source?.toLowerCase() === "examples") {
                rank += 2000;
            }

            if (nameMatch || codeMatch) {
                rank -= data.length - data.indexOf(item);
            }

            return {
                item: item,
                match: nameMatch || codeMatch,
                rank: nameMatch || codeMatch ? rank: Infinity
            };
        });
        
        result = result.filter(result => !!result.match);
        result.sort((a, b) => a.rank - b.rank);
        return result.map(item => item.item);
    };
    
    exports.addCommandShortcut = function addCommandShortcut(cmd) {
        const command = CommandManager.get(cmd);
        if (command) {
            KeyBindingManager.showShortcutSelectionDialog(command);
        } else {
            Dialogs.showError("Command not found! Try to add shortcut manually.");
        }
    };
    
    function updateList($list, data = [], noItemTemplate = "") {
        if (!$list?.length) return;
        
        const searchValue = $name(NAME.search).val();

        if (data.length === 0) {
            return $list.html(searchValue?.length ? "": noItemTemplate);
        }
        
        if (!HAS_NODE) {
            data = data.filter(item => item.env !== OPTIONS.ENV_NODE);
        }
        data.sort((a, b) => a.name.localeCompare(b.name));
        if (searchValue?.length) {
            data = exports.getSearchResults(data, searchValue);
        }

        const $prevItems = $list.find(`.${CLASS.item}`);
        $list.html(data.map(item => {
            const $item = $(TEMPLATE.item);
            $item[0].dataset[DATA.env] = item.env || OPTIONS.ENV_PHOENIX;
            $item[0].dataset[DATA.source] = item.path || "global";
            $item[0].dataset[DATA.name] = item.name || "Unknown";
            $item[0].dataset[DATA.cmd] = item.cmd || "";
            $item.find(`.${CLASS.listLink}`).text(item.name || "Unknown");
            
            if (!item.path || item.path === "global") {
                const $prev = $prevItems.filter((i, _item) => _item.dataset[DATA.name] === item.name);
                if ($prev.find(`.${CLASS.listShowActions}.${CLASS.isActive}`).length) {
                    $item.find(`.${CLASS.listShowActions}`).addClass(CLASS.isActive);
                }
            }
            
            return $item;
        }));
    }
    
    function useCode(name = "", code = "", env = OPTIONS.ENV_PHOENIX) {
        $name(NAME.name).val(name).change();
        codeMirror.setValue(code);
        $name(NAME.env).filter(`[value="${env}"]`)
            .prop("checked", true).change();
    }
    
    function hideItemActions(except) {
        $mainUI?.find(`.${CLASS.listShowActions}`)
            .filter((i, el) => el !== except)
            .removeClass(CLASS.isActive);
    }
    
    function initItemActions() {
        $mainUI.on("click", `[${ATTR.dataAction}]`, async (event) => {
            const item = event.currentTarget.closest(`.${CLASS.item}`);
            if (!item) return;
            
            const action = event.currentTarget.dataset[DATA.action];
            switch (action) {
                case "more": case "less": {
                    const more = item.querySelector(`.${CLASS.noContentMore}`);
                    if (!more) return;
                    more.hidden = action === "less";
                    event.currentTarget.innerHTML = action === "less" ? "…": "Hide";
                    event.currentTarget.dataset[DATA.action] = action === "less" ? "more": "less";
                    break;
                }
                    
                case "showCodeActions": {
                    hideItemActions(event.currentTarget);
                    event.currentTarget.classList.toggle(CLASS.isActive);
                    break;
                }
                    
                case "createCommand": {
                    const name = item.dataset[DATA.name];
                    const cmd = Code.createCommand(name);
                    if (cmd?.length) {
                        Dialogs.showCommandCreated(name, cmd);
                    } else {
                        Dialogs.showCommandNotCreated(name);
                    }
                    break;
                }
                    
                case "removeCommand": {
                    const name = item.dataset[DATA.name];
                    Dialogs.showConfirmCommandRemove(name, () => {
                        Code.removeCommand(name);
                        Dialogs.showCommandRemoved(name);
                    });
                    break;
                }
                    
                case "showCommandId": {
                    const name = item.dataset[DATA.name];
                    const cmd = item.dataset[DATA.cmd];
                    Dialogs.showCommandId(name, cmd);
                    break;
                }
                    
                case "addCommandShortcut": {
                    const cmd = item.dataset[DATA.cmd];
                    exports.addCommandShortcut(cmd);
                    break;
                }
                    
                case "removeCode": {
                    const name = item.dataset[DATA.name];
                    Dialogs.showConfirmRemove(name, () => {
                        Code.removeGlobalItem(name);
                    });
                    break;
                }

                case "useCode": {
                    const name = item.dataset[DATA.name] || "";
                    const source = item.dataset[DATA.source] || "global";
                    const env = item.dataset[DATA.env] || OPTIONS.ENV_PHOENIX;
                    const code = source === "global" ? 
                        Code.getItemByName(codeGlobal, name)?.code || "":
                        (await Code.getItemByPath(source))?.code || "";
                    useCode(name, code, env);
                    break;
                }
            }
        });
    }
    
    async function initLists() {
        codeGlobal = Code.getGlobal();
        const $listGlobal = $id(ID.listGlobal);
        updateList($listGlobal, codeGlobal, TEMPLATE.itemNoGlobal);
        Code.onGlobalChange(code => {
            codeGlobal = code;
            updateList($listGlobal, codeGlobal, TEMPLATE.itemNoGlobal);
        });
        Options.onChange(CONFIG.SEARCH_CODE, () => {
            updateList($listGlobal, codeGlobal, TEMPLATE.itemNoGlobal);
        });
        
        let codeLocal = [];
        const codeLocalPromise = Code.getFromDir(LOCAL_SOURCE());
        const $listLocal = $id(ID.listLocal);
        codeLocalPromise.then(code => {
            codeLocal = code;
            updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            Code.onDirChange(LOCAL_SOURCE(), code => {
                codeLocal = code;
                updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            });
        });
        ProjectManager.on("projectClose", () => {
            codeLocal = [];
            updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            Code.offDirChange(LOCAL_SOURCE());
        });
        ProjectManager.on("projectOpen", async () => {
            codeLocal = await Code.getFromDir(LOCAL_SOURCE());
            updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            Code.onDirChange(LOCAL_SOURCE(), code => {
                codeLocal = code;
                updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            });
        });

        $name(NAME.search).on("input change", event => {
            updateList($listGlobal, codeGlobal, TEMPLATE.itemNoGlobal);
            updateList($listLocal, codeLocal, TEMPLATE.itemNoLocal);
            localStorage.setItem(STORAGE.LAST_SEARCH, event.target.value);
        });
        
        let codeExamples = [];
        let $listExamples = null;
        const initExamples = () => {
            const codeExamplesPromise = Code.getFromDir(EXAMPLES_SOURCE);
            $listExamples = $id(ID.listExamples);
            codeExamplesPromise.then(code => {
                codeExamples = code;
                updateList($listExamples, codeExamples);
            });
            updateList($listExamples, codeExamples);
            $name(NAME.search).on("input change", event => {
                if (Options.get(CONFIG.SHOW_EXAMPLES) === OPTIONS.YES) {
                    updateList($listExamples, codeExamples);
                }
            });
        };
        if (Options.get(CONFIG.SHOW_EXAMPLES) === OPTIONS.YES) {
            initExamples();
        }
        Options.onChange(CONFIG.SHOW_EXAMPLES, async (show) => {
            if (show === OPTIONS.YES && !$listExamples) {
                return initExamples();
            }
            updateList($listExamples, show === OPTIONS.YES ? codeExamples: []);
        });

        const moveListToStart = $list => {
            const $listWrapper = $list.closest(`.${CLASS.listWrapper}`);
            $listWrapper.parent().prepend($listWrapper);
        };
        if (Options.get(CONFIG.GLOBAL_FIRST) === OPTIONS.NO) {
            moveListToStart($listLocal);
        }
        Options.onChange(CONFIG.GLOBAL_FIRST, globalFirst => {
            moveListToStart(globalFirst === OPTIONS.YES ? $listGlobal: $listLocal);
        });

        initItemActions();
    }
    
    function initEnvironment() {
        if (!HAS_NODE) {
            $mainUI.addClass(CLASS.noNode);
        }
        $name(NAME.env).filter(`[value="${OPTIONS.ENV_NODE}"]`)
            .prop("disabled", !HAS_NODE).change();
    }
    
    function initSaveBtn() {
        const $nameInput = $name(NAME.name);
        const $saveBtn = $id(ID.save);
        const updateDisabled = () => { 
            $saveBtn.prop(
                "disabled", 
                !$nameInput.val().length || 
                !codeMirror.getValue()?.length
            ); 
        };
        const updateAppearance = () => {
            const exists = Code.getItemByName(codeGlobal, $nameInput.val());
            $saveBtn.text(exists ? "Rewrite (global)": "Save (global)")
                .addClass(exists ? "danger": "primary")
                .removeClass(exists ? "primary": "danger");
        };

        $nameInput.on("change input", () => {
            updateDisabled();
            updateAppearance();
        }).change();
        codeMirror.on("update", updateDisabled);
        Code.onGlobalChange(updateAppearance);
        
        $saveBtn.on("click", async (event) => {
            const name = getValueFromMain("name");
            if (!$saveBtn.hasClass("danger")) {
                Code.saveGlobalItem(name, getValueFromMain("code"), undefined, getValueFromMain("env"));
                return;
            }
            Dialogs.showConfirmRewrite(name, () => {
                Code.saveGlobalItem(name, getValueFromMain("code"), undefined, getValueFromMain("env"));
            });
        });
    }
    
    exports.getOptionsByCurrentSelection = function getOptionsByCurrentSelection() {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return { xml: false };

        const selections = editor.getSelections();
        const XMLs = selections.map(selection => {
            const mode = editor.getModeForRange(selection.start, selection.end);
            const type = typeof mode === "object" ? 
                mode.name.match(/xml|svg|html/i): 
                mode.match(/xml|svg|html/i);
            return type && type[0].toLowerCase() !== "html";
        });
        const xml = XMLs.some(state => !state) === false;
        
        return { xml };
    };
    
    function setStateByCurrentSelection(event) {
        const autoOptions = Options.get(CONFIG.AUTO_OPTIONS);
        if (autoOptions === OPTIONS.NEVER) {
            return setExecButtonState();
        }
        if (autoOptions === OPTIONS.ON_OPEN) {
            if (event.type !== "open") {
                return setExecButtonState();
            }
        }
        if (autoOptions === OPTIONS.ON_EDITOR_CHANGE) {
            if (event.type !== "open" && event.type !== "activeEditorChange") {
                return setExecButtonState();
            }
        }
        
        const options = exports.getOptionsByCurrentSelection();
        $name(NAME.xml).prop("checked", options.xml).change();
        setExecButtonState();
    }

    function setExecButtonState(editor) {
        editor = typeof editor === "undefined" ? EditorManager.getActiveEditor(): editor;
        const selections = (editor?.getSelections() || []).length;
        $id(ID.exec).text(
            `Rewrite ${selections} selections`.replace(/s$/, selections === 1 ? "": "s")
        );
    }
    
    function setStateFromLastOptions() {
        $name(NAME.search).val(localStorage.getItem(STORAGE.LAST_SEARCH) || "").change();
        const lastOptions = JSON.parse(localStorage.getItem(STORAGE.LAST_OPTIONS));
        if (!lastOptions) return;
        useCode(lastOptions.name, lastOptions.code, lastOptions.env);
        $name(NAME.groupOutput).prop("checked", !!lastOptions.groupOutput).change();
    }

    function initMainActions() {
        let editor = EditorManager.getActiveEditor();
        
        const updateExecOutputState = () => {
            const code = codeMirror.getValue();
            $id(ID.exec).prop("disabled", !editor || !code?.length);
            $id(ID.output).prop("disabled", !editor || !code?.length).change();
        };
        updateExecOutputState();
        codeMirror.on("update", updateExecOutputState);
        
        editor?.on("cursorActivity", setStateByCurrentSelection);
        EditorManager.on("activeEditorChange", (event, active, inactive) => {
            editor = active;
            updateExecOutputState();
            if (inactive) {
                inactive.off("cursorActivity", setStateByCurrentSelection);
            }
            if (active) {
                active.on("cursorActivity", setStateByCurrentSelection);
                setStateByCurrentSelection(event);
            }
        });
        
        $mainUI.on("click", "button, a", async function (event) {
            if (this.disabled) return false;
            if (this.href === "#" || this.tagName === "BUTTON") {
                event.preventDefault();
            }
            
            switch (this.id) {
                case ID.clear:
                    codeMirror.setValue("");
                    $name(NAME.name).val("").change();
                    break;
                case ID.help:
                    Dialogs.showHelp();
                    break;
                case ID.close:
                    bottomPanel.hide();
                    break;
                case ID.clearSearch: 
                    $name(NAME.search).val("").change();
                    break;
                case ID.options: 
                    Options.showUI();
                    break;
                case ID.output: 
                    _onExecFns.forEach(fn => fn({ 
                        output: true, 
                        ...getOptionsFromMain() 
                    }));
                    break;
                case ID.exec: 
                    _onExecFns.forEach(fn => fn(
                        getOptionsFromMain()
                    ));
                    break;
            }
        });
    }

    async function initMainUI() {
        $mainUI = $(TEMPLATE.index);
        await initLists();
        initEditor();
        initEnvironment();
        initSaveBtn();
        initMainActions();
        $name(NAME.search).on("focus", ({target}) => target?.select());
        $name(NAME.name).on("focus", ({target}) => target?.select());
    }
    
    exports.openMain = async function openMain() {
        if (bottomPanel?.isVisible()) return bottomPanel.hide();
        if (!bottomPanel) {
            await initMainUI();
            setStateFromLastOptions();
            bottomPanel = WorkspaceManager.createBottomPanel(TITLE, $mainUI, PANEL_MIN_HEIGHT);
        }
        if (!bottomPanel || !codeMirror) return;
        
        bottomPanel.show();
        codeMirror.setSize("100%", "100%");
        codeMirror.scrollTo(0, 0);
        codeMirror.refresh();
        hideItemActions();
        setStateByCurrentSelection({ type: "open" });
    };
    
    exports.onExec = function onExec(fn) {
        _onExecFns.push(fn);
    };
    
    Object.assign(exports, Dialogs);
    Dialogs.init(exports);
    Object.assign(exports, Icon);
    Object.assign(exports, OptionsBar);
    OptionsBar.init(exports);
    Object.assign(exports, QuickExec);
    QuickExec.init(exports);
});