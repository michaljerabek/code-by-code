/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";
    
    const { HAS_NODE, NS, OPTIONS } = require("CONSTANTS");
    const EditorManager = brackets.getModule("editor/EditorManager");
    const { ModalBar } = brackets.getModule("widgets/ModalBar");
    
    let UI = null;

    const ID = {
        form: NS + "__options-bar-form",
        title: NS + "__options-bar-title",
        confirm: NS + "__options-bar-confirm"
    };
    
    const TEMPLATE = {
        optionsBar: require("text!UI/options-bar.html")
    }; 

    function getOptionsFromForm($form) {
        const formData = (new FormData($form[0]));
        return {
            env: formData.get(UI?.NAME.env) ?? OPTIONS.ENV_PHOENIX,
            xml: formData.get(UI?.NAME.xml) === "on",
            groupOutput: formData.get(UI?.NAME.groupOutput) === "on"
        };
    }
    
    function setInitialOptions($form, options) {
        $form.find(`[name="${UI?.NAME.groupOutput}"]`)
            .prop("checked", !!options.groupOutput).change();
        $form.find(`[name="${UI?.NAME.xml}"]`)
            .prop("checked", !!options.xml).change();
        const env = HAS_NODE ? options.env: OPTIONS.ENV_PHOENIX;
        $form.find(`[name="${UI?.NAME.env}"][value="${env || OPTIONS.ENV_PHOENIX}"]`)
            .prop("checked", true).change();
    }
    
    function initContent($modalBar, $form, title, isOutputCmd, editor) {
        $form.find(`#${ID.title}`).text(title);
        if (!HAS_NODE) {
            $form.addClass(UI?.CLASS.noNode);
        }
        $form.find(`[name="${UI?.NAME.env}"]`)
            .prop("disabled", !HAS_NODE);
        
        const selections = editor.getSelections().length;
        const $confirm = $form.find(`#${ID.confirm}`);

        $confirm.text(
            isOutputCmd ? 
                "Get output":
                `Rewrite ${selections} selections`.replace(/s$/, selections === 1 ? "": "s")
        );
    }
    
    function handleFocus($modalBar, $form) {
        const $controls = $form.find("input, button");
        $controls.not(":disabled")[0]?.focus();

        $modalBar.on("keydown." + NS, event => {
            if (event.key !== "Tab") return;
            event.preventDefault();
            
            const $focusableControls = $controls.not(":disabled").filter(`button, [type="checkbox"], [type="radio"]:checked`);
            let focusIndex = $focusableControls.index(document.activeElement);
            if (focusIndex === -1) return;
            focusIndex += event.shiftKey ? -1: 1;
            $focusableControls.toArray()
                .at(focusIndex % $focusableControls.length)?.focus();
        });
    }
    
    exports.showOptionsBar = async function showOptionsBar(title, initOptions, isOutputCmd = false) {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return Promise.resolve(null);
        initOptions = {...initOptions};
        
        const modalBar = new ModalBar(TEMPLATE.optionsBar, true);
        const $modalBar = modalBar.getRoot();
        const $form = $modalBar.find(`#${ID.form}`);
        
        initContent($modalBar, $form, title, isOutputCmd, editor);
        setInitialOptions($form, initOptions);
        handleFocus($modalBar, $form);
        
        return new Promise(resolve => {
            let confirmed = false;
            let keyDown = false;
            $modalBar.on("keydown." + NS, () => (keyDown = true));
            $modalBar.on("keyup." + NS + " click." + NS, (event) => {
                if (!keyDown) return;
                if ((event.type === "keyup" && event.key === "Enter") || 
                    (event.type === "keyup" && event.key === "Space" && event.target.id === ID.confirm) || 
                    (event.type === "click" && event.target.id === ID.confirm)
                ) {
                    event.stopImmediatePropagation();
                    confirmed = true;
                    modalBar.close();
                    return false;
                }
            });
            modalBar.one("close", () => {
                $modalBar.off("." + NS);
                const options = getOptionsFromForm($form);
                resolve(confirmed ? options: null);
            });
        });
    };
    
    exports.init = function init(exports) {
        UI = exports;
    };
});