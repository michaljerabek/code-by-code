/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";
    
    const { HAS_NODE, NS, CONFIG, STORAGE, OPTIONS, EXAMPLES_SOURCE, LOCAL_SOURCE } = require("CONSTANTS");
    const EditorManager = brackets.getModule("editor/EditorManager");
    const { ModalBar } = brackets.getModule("widgets/ModalBar");
    const { QuickSearchField } = brackets.getModule("search/QuickSearchField");
    
    const Code = require("Code");
    const Options = require("Options");
    let UI = null;

    const ID = {
        title: NS + "__quick-exec-title"
    };
    
    const TEMPLATE = {
        quickExec: require("text!UI/quick-exec.html")
    }; 
    
    const TO_HTML_SAFE_STRING_EL = document.createElement("div");

    function getItemsSortedByLastUsage(items) {
        const codeOrder = JSON.parse(localStorage.getItem(STORAGE.CODE_ORDER)) ?? [];
        if (items.length && codeOrder.length) {
            items.sort((a, b) => {
                let aI = codeOrder.findIndex(name => name === a.name);
                let bI = codeOrder.findIndex(name => name === b.name);
                if (aI === -1) { aI = Infinity; }
                if (bI === -1) { bI = Infinity; }
                return aI - bI;
            });
        }
        return items;
    }

    exports.showQuickExec = async function showQuickExec(title, isOutputCmd = false) {
        const editor = EditorManager.getActiveEditor();
        if (!editor?.document) return Promise.resolve(null);
        
        return new Promise(resolve => {
            const codeGlobal = Code.getGlobal();
            const codeLocalPromise = Code.getFromDir(LOCAL_SOURCE());
            const showExamples = Options.get(CONFIG.SHOW_EXAMPLES) === OPTIONS.YES;
            const codeExamplesPromise = showExamples ? Code.getFromDir(EXAMPLES_SOURCE): Promise.resolve([]);
            let codeAll = codeGlobal.map(item => ({...item, source: "Global"}));
            
            const modalBar = new ModalBar(TEMPLATE.quickExec, true);
            const $modalBar = modalBar.getRoot();
            $modalBar.find(`#${ID.title}`).text(title);
            const $search = $modalBar.find(`[name="${UI.NAME.search}"]`);
            let selectedItem = null;

            let shiftKey = false;
            const onKeydown = event => {
                shiftKey = event.shiftKey;
                if (event.key.startsWith("Alt")) {
                    event.stopPropagation();
                } 
            };
            const onKeyup = event => { shiftKey = event.shiftKey; };
            window.addEventListener("keydown", onKeydown, true);
            window.addEventListener("keyup", onKeyup, true);

            const quickSearchField = new QuickSearchField($search, { 
                resultProvider(value) {
                    const byLastUsage = getItemsSortedByLastUsage(codeAll)
                        .filter(item => HAS_NODE || item.env !== OPTIONS.ENV_NODE);
                    if (!value) return byLastUsage;
                    return UI?.getSearchResults(byLastUsage, value, true);
                },
                formatter(item) {
                    TO_HTML_SAFE_STRING_EL.innerHTML = "";
                    TO_HTML_SAFE_STRING_EL.appendChild(document.createTextNode(item.name));
                    return `<li style="display: flex; justify-content: space-between; gap: 10px;">
                        <span>${TO_HTML_SAFE_STRING_EL.innerHTML}</span>
                        <small>${item.source}</small>
                    </li>`;
                },
                onHighlight() {},
                onCommit(item) {
                    selectedItem = item;
                    modalBar.close();
                },
                verticalAdjust: $modalBar.outerHeight(),
                firstHighlightIndex: 0
            });
            quickSearchField.updateResults();
            
            codeLocalPromise.then(items => {
                codeAll = codeAll.concat(items.map(item => ({...item, source: "Local"})));
                quickSearchField.updateResults();
            });
            codeExamplesPromise.then(items => {
                codeAll = codeAll.concat(items.map(item => ({...item, source: "Examples"})));
                quickSearchField.updateResults();
            });

            modalBar.one("close", async (event, reason) => {
                window.removeEventListener("keydown", onKeydown, true);
                window.removeEventListener("keyup", onKeyup, true);
                $modalBar.off("." + NS);
                quickSearchField.destroy();
                
                if (!["blur", "escape"].includes(reason)) {
                    if (selectedItem && typeof selectedItem.code === "undefined") {
                        selectedItem = await Code.getItemByPath(selectedItem.path);
                    }
                    if (!selectedItem) return resolve({ error: "Code not found!" });
                    const options = {
                        name: selectedItem.name,
                        code: selectedItem.code,
                        env: selectedItem.env || OPTIONS.ENV_PHOENIX
                    };
                    Object.assign(options, UI?.getOptionsByCurrentSelection());
                    return resolve({ options, showOptions: shiftKey });
                }
                
                if (reason === undefined) return resolve({ error: "Code not found!" });
                return resolve(null);
            });
        });
    };

    exports.init = function init(exports) {
        UI = exports;
    };
});
