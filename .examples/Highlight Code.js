/* Highlight Code
 * 
 * Description:
 * Highlights syntax of a selected code using built-in CodeMirror[1].
 * 
 * Usage:
 * Select code, execute and in the shown dialog
 * choose language of the code.
 * 
 * [1] https://codemirror.net/5/
 * */

const CodeMirror = brackets.getModule("thirdparty/CodeMirror/lib/codemirror");
brackets.getModule(["thirdparty/CodeMirror/addon/runmode/runmode"]);

const modes = Object.keys(CodeMirror.modes).filter(mode => mode !== "null");
const order = ["javascript", "htmlmixed", "css", "sass", "less", "php", "jsx"];
modes.sort((a, b) => {
    let aI = order.findIndex(mode => mode === a);
    let bI = order.findIndex(mode => mode === b);
    if (aI === -1) { aI = Infinity; }
    if (bI === -1) { bI = Infinity; }
    return aI - bI;
});
const targetMode = await showSelectDialog("Select source language:", modes);
if (!targetMode) return;

const result = document.createElement("div");
CodeMirror.runMode(CONTENT, { name: targetMode }, result);
return result.innerHTML;