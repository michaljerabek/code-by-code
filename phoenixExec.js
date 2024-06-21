/*jslint evil: true, vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    const cheerio = require("cheerio/standalone");
    const jsBeautify = require("js-beautify/standalone");
    const htmlBeautify = require("js-beautify/standalone").html;
    const ____ = {
        objectPrint: require("js-object-pretty-print/standalone"),
        outputString: "",
        currentDoneFn: null,
        currentProcessID: null,
        onAbort: []
    };

    const { 
        showDialog, 
        showInputDialog, 
        showSelectDialog, 
        showCheckboxDialog,
        showRadioDialog 
    } = require("CodeDialogs");
    
    async function abort() {
        if (____.currentDoneFn) {
            ____.currentDoneFn("Aborted by user!");
            if (____.onAbort?.length) {
                ____.onAbort.forEach(fn => fn());
            }
        }
    }
    
    const STORAGE = {};

    async function exec([...____args] /*CONSTANTS, code, cheerioOptions, processID*/) {
        return await new Promise(async (____resolve) => {
            if (____.currentProcessID !== ____args[3]) {
                ____.currentProcessID = ____args[3];
                for (let prop in STORAGE) {
                    if (STORAGE.hasOwnProperty(prop)) {
                        delete STORAGE[prop];
                    }
                }
            }
            ____.onAbort = [];
            ____.outputString = "";

            const ENV = "phoenix";
            const XML = !!____args[2].xmlMode;
            const {
                PROJECT_DIR,
                FILE_DIR,
                FILE_PATH,
                FILE_NAME,
                SELECTIONS,
                SELECTION,
                CONTENT,
                LANGUAGE,
                INDEX,
                COMMAND
            } = ____args[0];

            const $ = cheerio.load(CONTENT, ____args[2], false);
            let isAsync = false;

            const outputString = (string = "") =>  ____.outputString += (____.outputString ? "\n" : "") + string;
            const outputObject = (object, options) => {
                const string = jsBeautify.js(____.objectPrint.pretty(object), options || {
                    "brace_style": "expand"
                });
                ____.outputString += (____.outputString ? "\n" : "") + string;
            };
            const outputJSON = (object, indent = 4) => {
                const string = JSON.stringify(object, null, indent);
                ____.outputString += (____.outputString ? "\n" : "") + string;
            };
            const outputHTML = (string, options = {}) => {
                string = jsBeautify.html(string, options);
                ____.outputString += (____.outputString ? "\n" : "") + string;
            };

            let getModifiedContent = () => $[____args[2].xmlMode ? "xml": "html"]();

            const onAbort = fn => ____.onAbort.push(fn);
            const done = err => {
                if (!____.currentDoneFn) return;
                ____.currentDoneFn = null;
                if (err) {
                    ____resolve({ error: err.toString() });
                } else {
                    ____resolve({
                        content: COMMAND === "rewrite" ? getModifiedContent(): "",
                        string: ____.outputString
                    });
                }
            };
            ____.currentDoneFn = done;

            try {
                const returnValue = await eval(`(async function () {
                    ${____args[1]};
                })();`);
                if (typeof returnValue === "string" || typeof returnValue === "number") {
                    if (COMMAND === "rewrite") {
                        getModifiedContent = () => String(returnValue);
                    }
                    if (COMMAND === "output") {
                        outputString(String(returnValue));
                    }
                }
                if (!isAsync) done();
            } catch (err) {
                console.log(err);
                done(err.toString());
            }
        });
    }

    exports.exec = exec;
    exports.abort = abort;
});