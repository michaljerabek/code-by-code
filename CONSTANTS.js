/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    const NodeConnector = brackets.getModule("NodeConnector");
    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    const ProjectManager = brackets.getModule("project/ProjectManager");
    const PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    
    exports.DEV = false;
    exports.HAS_NODE = NodeConnector.isNodeAvailable();
    exports.CMD_PREFIX = "mjerabek.cz.codebycode";
    exports.PREFS_PREFIX = "mjerabek.cz.codebycode";
    exports.NS = "mjerabek-cz__codebycode";
    exports.TITLE = "Code By Code";
    exports.MODULES_DIR = "mjerabek.cz.codebycode";

    exports.CHEERIO_OPTIONS = (data = {}) => ({
        _useHtmlParser2: true,
        withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: data.xml || false,
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
        recognizeSelfClosing: true
    });

    exports.STORAGE = {
        LAST_OPTIONS: exports.NS + ":lastOptions",
        CODE_ORDER: exports.NS + ":codeOrder",
        LAST_SEARCH: exports.NS + ":lastSearch",
    };

    exports.COMMAND = {
        OPEN_MAIN_UI: exports.CMD_PREFIX + ".openMainUI",
        EXEC_LAST: exports.CMD_PREFIX + ".execLast",
        OUTPUT_LAST: exports.CMD_PREFIX + ".outputLast",
        EXEC_LAST_OPTIONS: exports.CMD_PREFIX + ".execLastOptions",
        OUTPUT_LAST_OPTIONS: exports.CMD_PREFIX + ".outputLastOptions",
        QUICK_EXEC: exports.CMD_PREFIX + ".quickExec",
        QUICK_OUTPUT: exports.CMD_PREFIX + ".quickOutput",
    };

    exports.COMMAND_NAME = {
        [exports.COMMAND.OPEN_MAIN_UI]: cmdsAsSubmenu => cmdsAsSubmenu ? "Open": (exports.TITLE + ": Open"),
        [exports.COMMAND.QUICK_EXEC]: "Quick Execute | Rewrite",
        [exports.COMMAND.QUICK_OUTPUT]: "Quick Execute | Get Output",
        [exports.COMMAND.EXEC_LAST]: "Execute Last | Rewrite",
        [exports.COMMAND.OUTPUT_LAST]: "Execute Last | Get Output",
        [exports.COMMAND.EXEC_LAST_OPTIONS]: "Execute Last | Rewrite with Options",
        [exports.COMMAND.OUTPUT_LAST_OPTIONS]: "Execute Last | Get Output with Options",
    };

    exports.OPTIONS = {
        ENV_NODE: "node",
        ENV_PHOENIX: "phoenix",
        YES: "Yes",
        NO: "No",
        NEVER: "Never",
        ON_OPEN: "On open",
        ON_EDITOR_CHANGE: "On editor change",
        ON_SELECTION_CHANGE: "On selection change",
        ITEMS: "Items",
        SUBMENU: "Submenu"
    };

    exports.CONFIG = {
        CODE_GLOBAL: "codeGlobal",
        CODE_LOCAL: "codeLocal",
        SHOW_EXAMPLES: "showExamples",
        SEARCH_CODE: "searchCode",
        GLOBAL_FIRST: "globalFirst",
        AUTO_OPTIONS: "autoOptions",
        MENU_APPEARANCE: "menuAppearance",
        INDENTATION: "indentation",
        
        DEFAULT: {
            CODE_LOCAL: ".phoenix/codebycode"
        }
    };
    
    const prefs = PreferencesManager.getExtensionPrefs(exports.PREFS_PREFIX);
    exports.EXAMPLES_SOURCE = `${ExtensionUtils.getModulePath(module)}.examples/`;
    exports.LOCAL_SOURCE = () => `${ProjectManager.getProjectRoot().fullPath}${prefs.get(exports.CONFIG.CODE_LOCAL) ?? exports.CONFIG.DEFAULT.CODE_LOCAL}/`;
});