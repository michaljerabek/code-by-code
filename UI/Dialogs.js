/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    const { DEV, HAS_NODE, NS, TITLE, CONFIG, OPTIONS, MODULES_DIR } = require("CONSTANTS");
    const Dialogs = brackets.getModule("widgets/Dialogs");
    const Options = require("../Options");
    const Icon = require("UI/Icon");
    require("cheerio/browser");
    let UI = null;
    
    const ID = {
        modulesDir: NS + "__modules-dir",
        output: NS + "__output"
    };
        
    const CLASS = {
        dialog: "mj-codebycode__dialog",
        helpDialog: NS + "__help-dialog",
        outputDialog: NS + "__output-dialog",
        output: "mj-codebycode__output",
        noOutput: "mj-codebycode__no-output",
        outputInput: "mj-codebycode__output-input"
    };

    const DATA = {
        action: "action"
    };
        
    const ATTR = {
        dataAction: "data-action"
    };
    
    const TEMPLATE = {
        output: require("text!UI/output.html"),
        help: require("text!UI/help.html")
    }; 

    const $help = cheerio.load(TEMPLATE.help);
    $help(`#${ID.modulesDir}`).text(MODULES_DIR);
    TEMPLATE.help = $help.html();

    let waitDialog = null;
    
    function escapeHTML(html) {
        return typeof html !== "string" ? "" :
        html.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    exports.getDialog = function getDialog(content, okBtn, cancelBtn, className, title, moreBtns = []) {
        let btns = [];
        if (okBtn) {
            btns.push(
                Object.assign({
                    className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
                    id: Dialogs.DIALOG_BTN_OK
                }, 
                typeof okBtn === "string" ? { text: okBtn }: okBtn)
            );
        }
        if (cancelBtn) {
            btns.push(
                Object.assign({
                    className: Dialogs.DIALOG_BTN_CLASS_LEFT,
                    id: Dialogs.DIALOG_BTN_CANCEL
                }, 
                typeof cancelBtn === "string" ? { text: cancelBtn }: cancelBtn)
            );
        }
        btns = [...btns, ...moreBtns];

        return Dialogs.showModalDialog(className || CLASS.dialog, TITLE + (title ? `: ${title}`: ""), content, btns);
    };
    
    exports.showHelp = function showHelp() {
        const className = (HAS_NODE ? "": UI?.CLASS.noNode) + " " + CLASS.helpDialog;

        exports.getDialog(TEMPLATE.help, "Close", null, className, "Help");
    };

    function copyOutputContent($output) {
        const $input = $output.find(`.${CLASS.outputInput}`);
        if (!$input.length) return;
        $input[0].select();
        document.execCommand("copy");
    }

    exports.showOutputs = function showOutputs(strings, group) {
        if (waitDialog) {
            waitDialog.close();
        }

        let template = "";
        const stringsWithContent = strings.filter(string => string?.length);
        const diff = Math.abs(stringsWithContent.length - strings.length);
        template += !diff ? "": `<p class="${CLASS.noOutput}">No output for ${diff + " selections".replace(/s$/, diff > 1 ? "s": "")}.</p>`;
        const stringsToTemplate = group ? [stringsWithContent.join("\n")]: stringsWithContent;
        template += stringsToTemplate.map((string, i) => TEMPLATE.output.replace(/\{\{index\}\}/gi, i)).join("");
        
        const dialog = exports.getDialog(template, "Close", null, CLASS.outputDialog, "Output");
        const $dialogEl = dialog.getElement();
        $dialogEl.find(`.${CLASS.outputInput}`)
            .each((i, input) => { 
                input.value = stringsToTemplate[i];
                input.style.minHeight = `${Math.min(7, stringsToTemplate[i].split("\n").length || 1)}lh`;
            });

        $dialogEl.on("click." + NS, `[${ATTR.dataAction}]`, event => {
            event.preventDefault();
            const $link = $(event.currentTarget);
            const action = $link.data(DATA.action);
            if (action === "copy") {
                copyOutputContent($link.closest(`.${CLASS.output}`));
            }
        });
        dialog.done(() => $dialogEl.off("." + NS));
    };

    exports.showConfirmRemove = async function showConfirmRemove(name, onOk) {
        const confirmDialog = exports.getDialog(
            `Do you really want to remove <em>${name}</em>?`, 
            { text: "Remove", className: "danger" }, 
            "Cancel",
            null,
            "Remove code"
        );
        const answer = await confirmDialog.getPromise();
        if (answer === Dialogs.DIALOG_BTN_OK) {
            onOk();
        }
    };

    exports.showConfirmCommandRemove = async function showConfirmCommandRemove(name, onOk) {
        const confirmDialog = exports.getDialog(
            `Do you really want to remove command for <em>${name}</em>?`, 
            { text: "Remove", className: "danger" }, 
            "Cancel",
            null,
            "Remove command"
        );
        const answer = await confirmDialog.getPromise();
        if (answer === Dialogs.DIALOG_BTN_OK) {
            onOk();
        }
    };

    exports.showCommandRemoved = async function showCommandRemoved(name) {
        exports.getDialog(
            `Command for <em>${name}</em> was removed. It will take full effect after restarting.`, 
            { text: "OK" }, 
            "Cancel",
            null,
            "Command Removed"
        );
    };

    exports.showCommandCreated = async function showCommandCreated(name, cmd) {
        const shortcutBtn = {
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: "shortcut",
            text: "Add Shortcut"
        };

        const dialog = exports.getDialog(
            `Command for <em>${name}</em> was created with id <em style="user-select: all; cursor: pointer; text-decoration: underline dotted" title="Copy" onclick="document.execCommand('copy')">${cmd}</em>. Now you can assign a keyboard shortcut for this code.`, 
            { text: "OK" }, 
            "Cancel",
            null,
            "Command Created",
            [shortcutBtn]
        );
        
        const answer = await dialog.getPromise();
        if (answer === shortcutBtn.id) {
            UI.addCommandShortcut(cmd);
        }
    };

    exports.showCommandId = async function showCommandId(name, cmd) {
        exports.getDialog(
            `Command id for <em>${name}</em> is <em style="user-select: all; cursor: pointer; text-decoration: underline dotted" title="Copy" onclick="document.execCommand('copy')">${cmd}</em>.`, 
            { text: "OK" }, 
            "Cancel",
            null,
            "Command Id"
        );
    };

    exports.showCommandNotCreated = async function showCommandNotCreated(name) {
        const confirmDialog = exports.getDialog(
            `Command for <em>${name}</em> could not be created.`, 
            { text: "OK" }, 
            "Cancel",
            null,
            "Command Not Created"
        );
    };

    exports.showConfirmRewrite = async function showConfirmRewrite(name, onOk) {
        const confirmDialog = exports.getDialog(
            `Do you really want to rewrite <em>${name}</em>?`, 
            { text: "Rewrite", className: "danger" }, 
            "Cancel",
            null,
            "Rewrite code"
        );
        const answer = await confirmDialog.getPromise();
        if (answer === Dialogs.DIALOG_BTN_OK) {
            onOk();
        }
    };
    
    exports.showError = function showError(error) {
        if (waitDialog) {
            waitDialog.close();
        }
        exports.getDialog(escapeHTML(error || "Unknown error."), "OK", null, null, "Error");
    };

    exports.showSuccess = function showSuccess() {
        if (waitDialog) {
            waitDialog.close();
        }
        NotificationUI.createFromTemplate(
            "Code was successfully executed.",
            Icon.getIcon().attr("id"),
            {
                autoCloseTimeS: 5,
                dismissOnClick: true
            }
        );
    };

    exports.showCancelled = function showCancelled() {
        NotificationUI.createFromTemplate(
            "Execution cancelled.",
            Icon.getIcon().attr("id"),
            {
                autoCloseTimeS: 5,
                dismissOnClick: true
            }
        );
    };

    exports.showWait = function showWait(onAbort) {
        if (!waitDialog) {
            waitDialog = exports.getDialog(
                "Please wait.", 
                { text: "Abort", className: "danger" },
                null,
                null,
                "Executing"
            );
            waitDialog.done(btnId => {
                waitDialog = null;
                if (btnId === Dialogs.DIALOG_BTN_CANCEL || btnId === Dialogs.DIALOG_BTN_OK) {
                    onAbort();
                }
            });
        }
    };

    exports.init = function init(exports) {
        UI = exports;
    };
});