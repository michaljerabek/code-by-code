/* Sort By Element
 * 
 * Description:
 * Sorts sibling elements according to the content 
 * of specified children.
 * 
 * Usage:
 * Select an HTML list of elements or their parent, execute
 * and in the shown dialog set a selector for element to sort by.
 * 
 * Example: 
 * Select HTML like: 
   <ul>
       <li>
           <h2>Xylophone</h2>
           <p>Xylophone info.</p>
       </li>
       <li>
           <h2>Alphabet</h2>
           <p>Alphabet info.</p>
       </li>
   </ul>
 * Execute.
 * In the dialog set "h2".
 * */

let $toSort = $.root().children();
if ($toSort.length === 1) {
    $toSort = $toSort.children();
}

const sortBySelector = await showInputDialog("Set selector for element to sort by:");
if (sortBySelector === null) return;

const $sorted = $($toSort.toArray().sort((a, b) => {
    const aText = $(a).find(sortBySelector || "*").text();
    const bText = $(b).find(sortBySelector || "*").text();
    return aText.localeCompare(bText);
}));
const $parent = $toSort.parent().length ? $toSort.parent(): $.root();
$parent.html($sorted);

const indentBySelection = COMMAND !== "output" && SELECTION.start.ch !== 0;
const indent = indentBySelection ? SELECTION.start.ch: CONTENT.match(/^\s*/)?.[0].length || 0;
let code = htmlBeautify(getModifiedContent().trim());
code = code.replace(/^/mg, " ".repeat(indent));
code += COMMAND !== "output" && CONTENT.match(/\n$/) ? "\n": "";
return indentBySelection ? code.trim(): code;