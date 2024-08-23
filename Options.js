/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    const { HAS_NODE, NS, TITLE, PREFS_PREFIX, CONFIG, OPTIONS } = require("CONSTANTS");

    const Dialogs = brackets.getModule("widgets/Dialogs");
    const PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    const prefs = PreferencesManager.getExtensionPrefs(PREFS_PREFIX);

    const ID = {
        getId: ((counter) => () => (NS + "__options-dialog-id-" + counter++))(1)
    };
    
    const REGISTERED_OPTIONS = [];

    function getOptionsContent() {
        return `<form onsubmit="event.preventDefault();">${
            REGISTERED_OPTIONS
                .map(item => item.template())
                .join(`<div style="height: 15px"></div>`)
        }</form>`;
    }

    function registerDivider() {
        REGISTERED_OPTIONS.push({
            template: () => `<hr style="margin: 0; border-bottom: none; opacity: 0.25;">`
        });
    }

    function registerTitle(content) {
        REGISTERED_OPTIONS.push({
            template: () => `<h3 style="margin: 0; line-height: normal;">${content}</h3>`
        });
    }

    function registerText(prefName, options = {}) {
        const pref = prefs.getPreference(prefName);
        const id = ID.getId();

        REGISTERED_OPTIONS.push({
            prefName,
            template: () => {
                const currentValue = prefs.get(prefName);
                return `
                    <div data-pref-name="${prefName}">
                        <label for="${id}">${options.description ?? pref.description}${options.restartRequired ? " <em>(Requires restart.)</em>": ""}</label>
                        <input style="margin: 0px" id="${id}" type="text" name="${prefName}" value="${currentValue}">
                        <small style="display: block; margin-top: 2px; font-style: italic; opacity: 0.7;" ${options.note ? "": "hidden"}>${options.note ?? ""}</small>   
                    </div>`;
            },
            onSave(formData) {
                const value = formData.get(prefName);
                if (value !== prefs.get(prefName)) {
                    prefs.set(prefName, value);
                }
            }
        });
    }
    
    function registerSelect(prefName, options = {}) {
        const pref = prefs.getPreference(prefName);
        const id = ID.getId();

        REGISTERED_OPTIONS.push({
            prefName,
            template: () => {
                const currentValue = prefs.get(prefName);
                return `
                    <div data-pref-name="${prefName}">
                        <label for="${id}">${options.description ?? pref.description}${options.restartRequired ? " <em>(Requires restart.)</em>": ""}</label>
                        <select style="margin: 0px" id="${id}" name="${prefName}">
                            ${pref.values.map(item => `
                                <option ${item === currentValue ? "selected": ""} value="${item}">
                                    ${item}
                                </option>
                            `)}
                        </select>
                        <small style="display: block; margin-top: 2px; font-style: italic; opacity: 0.7;" ${options.note ? "": "hidden"}>${options.note ?? ""}</small>   
                    </div>
                `;
            },
            onSave(formData) {
                let value = formData.get(prefName);
                if (pref.type === "number") {
                    value = parseFloat(value);
                    value = isNaN(value) ? pref.initial: value;
                }
                if (value !== prefs.get(prefName)) {
                    prefs.set(prefName, value);
                }
            }
        });
    }

    prefs.definePreference(CONFIG.CODE_GLOBAL, "array", [], {
        description: HAS_NODE ?
            `Array of saved global codes. Format: { "name": String, "code": String, "cmd?": String, "env?": "phoenix" | "node" }`:
            `Array of saved global codes. Format: { "name": String, "code": String, "cmd?": String }`
    });
    
    prefs.definePreference(CONFIG.CODE_LOCAL, "string", CONFIG.DEFAULT.CODE_LOCAL, {
        description: "Relative path to local codes (no slash at the start and at the end). (Requires restart.)"
    });

    registerText(CONFIG.CODE_LOCAL, {
        description: "Relative path to local codes.",
        note: "No slash at the start and at the end.",
        restartRequired: true
    });

    prefs.definePreference(CONFIG.GLOBAL_FIRST, "string", OPTIONS.YES, {
        description: "Show global codes first?",
        values: [OPTIONS.YES, OPTIONS.NO]
    });

    registerSelect(CONFIG.GLOBAL_FIRST);
    
    prefs.definePreference(CONFIG.SHOW_EXAMPLES, "string", OPTIONS.YES, {
        description: "Show code examples?",
        values: [OPTIONS.YES, OPTIONS.NO]
    });
    
    registerSelect(CONFIG.SHOW_EXAMPLES);

    prefs.definePreference(CONFIG.SEARCH_CODE, "string", OPTIONS.YES, {
        description: "Search in the global codes content?",
        values: [OPTIONS.YES, OPTIONS.NO]
    });
    
    registerSelect(CONFIG.SEARCH_CODE);

    prefs.definePreference(CONFIG.AUTO_OPTIONS, "string", OPTIONS.ON_SELECTION_CHANGE, {
        description: "When to auto-set options (XML mode) for execution.",
        values: [OPTIONS.ON_SELECTION_CHANGE, OPTIONS.ON_EDITOR_CHANGE, OPTIONS.ON_OPEN, OPTIONS.NEVER]
    });
    
    registerSelect(CONFIG.AUTO_OPTIONS);

    prefs.definePreference(CONFIG.INDENTATION, "number", 4, {
        description: "Number of spaces for indentation in the code editor.",
        values: [4, 2]
    });
    
    registerSelect(CONFIG.INDENTATION);

    prefs.definePreference(CONFIG.MENU_APPEARANCE, "string", OPTIONS.SUBMENU, {
        description: "How to show commands in the Edit menu. (Requires restart.)",
        values: [OPTIONS.SUBMENU, OPTIONS.ITEMS]
    });
    
    registerSelect(CONFIG.MENU_APPEARANCE, {
        description: "How to show commands in the Edit menu.",
        restartRequired: true
    });

    exports.showUI = function showUI() {
        if (!prefs) return null;
        const content = getOptionsContent();
        const btns = [
            {
                className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                id: Dialogs.DIALOG_BTN_OK,
                text: "Save"
            },
            {
                className: Dialogs.DIALOG_BTN_CLASS_LEFT,
                id: Dialogs.DIALOG_BTN_CANCEL,
                text: "Cancel"
            }
        ];

        const dialog = Dialogs.showModalDialog(NS, TITLE + ": Options", content, btns);
        const $dialog = dialog.getElement();
        const form = $dialog.find("form")[0];

        $dialog.on("keyup." + NS, "input", function (event) {
            if (event.key === "Enter") {
                $dialog.find(`[data-button-id="${Dialogs.DIALOG_BTN_OK}"]`).click();
            }
        });

        dialog.done(function (btnId) {
            $dialog.off("." + NS);

            if (btnId === Dialogs.DIALOG_BTN_OK) {
                const formData = new FormData(form);
                REGISTERED_OPTIONS.forEach(item => {
                    if (item.onSave) {
                        item.onSave(formData);
                    }
                });
            }
        });

        return dialog;
    };
    
    exports.onChange = function onChange(prop, fn) {
        return prefs?.on("change", prop, () => fn(prefs?.get(prop)));
    };

    exports.get = function get(prop) {
        return prefs?.get(prop);
    };

    exports.set = function set(prop, value) {
        return prefs?.set(prop, value);
    };
});
