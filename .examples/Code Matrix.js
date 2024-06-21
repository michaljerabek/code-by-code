/* Code Metrix
 * 
 * Usage:
 * Select some colorful code and execute.
 * */

const EditorManager = brackets.getModule("editor/EditorManager");
const activeEditor = EditorManager.getActiveEditor();
const codeMirror = activeEditor._codeMirror;

const scrollerRect = codeMirror.display.scroller.getBoundingClientRect();
const scroll = codeMirror.getScrollInfo();

for (let l = 0; l < CONTENT.length; l++) {
    if (CONTENT[l].match(/\s/)) continue;
    
    const position = codeMirror.findPosH(SELECTION.start, l, "char");
    const position2 = codeMirror.findPosH(SELECTION.start, l + 1, "char");
    const {top, left} = codeMirror.charCoords(position);
    const token = codeMirror.getTokenAt(position2);
    const verCount = 7 + Math.floor(Math.random() * 5);
    
    for (let i = 1; i <= verCount; i++) {
        const outerSpan = document.createElement("span");
        const innerSpan = document.createElement("span");
        outerSpan.appendChild(innerSpan);
        
        outerSpan.style.cssText = `
            position: absolute; 
            top: calc(${top - scrollerRect.top + scroll.top}px + ${i}lh);
            left: ${left - scrollerRect.left + scroll.left}px;
            opacity: 0;
            pointer-events: none;`;
        outerSpan.className = token.type?.replace(/^|\s/g, " cm-") ?? "";
        innerSpan.textContent = CONTENT[l];

        const flickerKfs = [];
        for (let f = 0; f < 15; f++) {
            const opacityBase = (2 - Math.max(i, verCount - 4) / (verCount - 4));
            flickerKfs.push({
                opacity: Math.max(0, opacityBase - (Math.random() * opacityBase) * 0.7).toFixed(1)
            });
        }
        const flickerAnim = innerSpan.animate(flickerKfs, {
            iterations: Infinity,
            easing: "steps(30)",
            duration: 3000
        });

        const showAnim = outerSpan.animate(
            [ 
                { opacity: 0 },
                { opacity: 1, offset: 0.0125 },
                { opacity: 1, offset: 0.9750 },
                { opacity: 0 } 
            ], 
            { 
                iterations: 1,
                easing: "linear",
                delay: ((20 + Math.random() * 30) * (i - 1)) + ((1 + Math.random() * 5) * l),
                duration: 3000 + (Math.random() * 150)
            }
        );
        
        showAnim.finished.then(() => {
            flickerAnim.cancel();
            outerSpan.remove();
        });

        codeMirror.display.scroller.append(outerSpan);
    }
}

getModifiedContent = () => CONTENT;