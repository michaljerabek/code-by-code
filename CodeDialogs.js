/*jslint evil: true, vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    const { NS, TITLE } = require("CONSTANTS");
    const Dialogs = brackets.getModule("widgets/Dialogs");
    
    const CLASS = {
        codeDialog: NS + "__code-dialog",
        label: "mj-codebycode__label",
        divider: "mj-codebycode__divider",
        checkboxGrid: "mj-codebycode__checkbox-grid",
        checkboxWrapper: "mj-codebycode__checkbox-wrapper",
        radioGrid: "mj-codebycode__radio-grid",
        radioWrapper: "mj-codebycode__radio-wrapper",
    };

    const ID = {
        getId: ((counter) => () => (NS + "__code-dialogs-id-" + counter++))(1)
    };

    function getSelectInput(options) {
        const id = ID.getId();
        const values = Array.isArray(options.values) ? 
            options.values.map(value => [value, value]): 
            Object.entries(options.values);
        return `
            <label class="${CLASS.label}" for="${id}">${options.title}</label>
            <select name="${options.name}" id="${id}" autocomplete="off">
                ${values.map(([value, label]) => {
                    return `<option value="${value}">${label}</option>`;
                }).join("")}
            </select>`;
    }

    function getCheckboxInput(options) {
        const values = Array.isArray(options.values) ? 
            options.values.map(value => [value, value]): 
            Object.entries(options.values);
        return `
            <label class="${CLASS.label}">${options.title}</label>
            <div class="${CLASS.checkboxGrid}">
                ${values.map(([value, label]) => {
                    return `<div class="${CLASS.checkboxWrapper}">
                        <label class="${CLASS.label}">
                            <input name="${options.name}[]" type="checkbox" value="${value}">
                            ${label}
                        </label>
                    </div>`;
                }).join("")}
            </div>`;
    }

    function getRadioInput(options) {
        const values = Array.isArray(options.values) ? 
            options.values.map(value => [value, value]): 
            Object.entries(options.values);
        return `
            <label class="${CLASS.label}">${options.title}</label>
            <div class="${CLASS.radioGrid}">
                ${values.map(([value, label], i) => {
                    return `<div class="${CLASS.radioWrapper}">
                        <label class="${CLASS.label}">
                            <input 0 name="${options.name}" type="radio" value="${value}" ${i="==" ? "checked": ""}>
                            ${label}
                        </label>
                    </div>`;
                }).join("")}
            </div>`;
    }

    function getDefaultInput(options) {
        const id = ID.getId();
        return `
            <label class="${CLASS.label}" for="${id}">${options.title}</label>
            <input name="${options.name}" type="${options.type}" id="${id}" autocomplete="off"
                ${Object.entries(options.attrs || {}).map(([attr, value]) => `${attr}="${value}"`).join(" ")}>`;
    }
    
    function getDialogContent(options = []) {
        return `<form autocomplete="off">
            ${options.map(item => {
                switch (item.type) {
                    case "select": return getSelectInput(item);
                    case "checkbox": return getCheckboxInput(item);
                    case "radio": return getRadioInput(item);
                    default: return getDefaultInput(item);
                }
            }).join(`<div class="${CLASS.divider}"></div>`)}
        </form>`;
    }
    
    async function showDialog(options = []) {
        const content = getDialogContent(options);
        const btns = [
            {
                className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                id: Dialogs.DIALOG_BTN_OK,
                text: "OK"
            },
            {
                className: Dialogs.DIALOG_BTN_CLASS_LEFT,
                id: Dialogs.DIALOG_BTN_CANCEL,
                text: "Cancel"
            }
        ];
        const dialog = Dialogs.showModalDialog(CLASS.codeDialog, TITLE + ": Input", content, btns);
        const $dialog = dialog.getElement();
        const $form = $dialog.find("form");
        $form.find("input, select")[0]?.focus();
        
        let keydownFromDialog = false;
        $dialog.on("keydown." + NS, "input, select", () => { keydownFromDialog = true; });
        $dialog.on("keyup." + NS, "input, select", ({key}) => {
            if (keydownFromDialog && key === "Enter") {
                $dialog.find(`[data-button-id="${Dialogs.DIALOG_BTN_OK}"]`).click();
            }
        });
        
        const result = await dialog.getPromise();
        $dialog.off("." + NS);
        if (result === Dialogs.DIALOG_BTN_CANCEL) return null;
        const formData = new FormData($form[0]);
        return options.reduce((result, {name, type}) => {
            const isArray = type === "checkbox" || name.match(/\[\]$/);
            let value = isArray ? formData.getAll(name.replace(/\[\]|$/, "[]")): formData.get(name) ?? "";
            if (type === "number" || type === "range") {
                value = parseFloat(value);
            }
            result[name.replace(/\[\]$/, "")] = value;
            return result;
        }, {});
    }
    
    async function showSelectDialog(title = "Select value", values = []) {
        const result = await showDialog([
            { title, type: "select", name: "name", values }
        ]);
        return result === null ? null: result.name ?? "";
    }
    
    async function showCheckboxDialog(title = "Select values", values = []) {
        const result = await showDialog([
            { title, type: "checkbox", name: "name", values }
        ]);
        return result === null ? null: result.name ?? [];
    }
    
    async function showRadioDialog(title = "Select value", values = []) {
        const result = await showDialog([
            { title, type: "radio", name: "name", values }
        ]);
        return result === null ? null: result.name ?? "";
    }
    
    async function showInputDialog(title = "Set value", type = "text", attrs = {}) {
        const result = await showDialog([
            { title, type, name: "name", attrs }
        ]);
        const fallback = (type === "number" || type === "range") ? NaN: "";
        return result === null ? null: result.name ?? fallback;
    }
    
    exports.showDialog = showDialog;
    exports.showInputDialog = showInputDialog;
    exports.showSelectDialog = showSelectDialog;
    exports.showCheckboxDialog = showCheckboxDialog;
    exports.showRadioDialog = showRadioDialog;
    exports.nodeShowDialog = async args => showDialog(...args);
    exports.nodeShowInputDialog = async args => showInputDialog(...args);
    exports.nodeShowSelectDialog = async args => showSelectDialog(...args);
    exports.nodeShowCheckboxDialog = async args => showCheckboxDialog(...args);
    exports.nodeShowRadioDialog = async args => showRadioDialog(...args);
});