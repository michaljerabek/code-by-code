/*jshint evil: true*/
const nodeConnector = global.createNodeConnector("mjerabek.cz.codebycode", exports);

const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const cheerio = require("./cheerio/standalone.js");
const jsBeautify = require("./js-beautify/standalone.js");
const htmlBeautify = jsBeautify.html;
const ____ = {
    objectPrint: require("./js-object-pretty-print/standalone.js"),
    appSupportDir: "",
    outputString: "",
    currentDoneFn: null,
    currentProcessID: null,
    onAbort: []
};

const MODULES = {};
function loadModule(moduleName, update = false) {
    if (!moduleName) return null;
    if (MODULES[moduleName]) return MODULES[moduleName];
    
    const cwd = path.resolve(____.appSupportDir);
    const nodeModules = path.resolve(cwd, "node_modules");
    if (!fs.existsSync(cwd)) {
        try { fs.mkdirSync(cwd); } catch (e) {}
    }

    if (fs.existsSync(path.resolve(nodeModules, moduleName))) {
        if (update) {
            childProcess.execSync(`npm update ${moduleName} --save`, { cwd });
        }
    } else {
        childProcess.execSync(`npm install ${moduleName}`, { cwd });
    }
    const modulePath = require.resolve(moduleName, { paths: [nodeModules] });
    MODULES[moduleName] = require(modulePath);
    return MODULES[moduleName] || null;
}

async function abort() {
    if (____.currentDoneFn) {
        ____.currentDoneFn("Aborted by user!");
        if (____.onAbort?.length) {
            ____.onAbort.forEach(fn => fn());
        }
    }
}

const STORAGE = {};

async function showDialog(...args) {
    return await nodeConnector.execPeer("nodeShowDialog", args);    
} 

async function showInputDialog(...args) {
    return await nodeConnector.execPeer("nodeShowInputDialog", args);    
} 

async function showSelectDialog(...args) {
    return await nodeConnector.execPeer("nodeShowSelectDialog", args);    
} 

async function showCheckboxDialog(...args) {
    return await nodeConnector.execPeer("nodeShowCheckboxDialog", args);    
}

async function showRadioDialog(...args) {
    return await nodeConnector.execPeer("nodeShowRadioDialog", args);    
}

async function exec([...____args] /*CONSTANTS, code, cheerioOptions, processID, appSupportDir*/) {
    ____.appSupportDir = ____args[4];

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

        const ENV = "node";
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
