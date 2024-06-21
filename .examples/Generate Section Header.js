/* Generate Section Header
 * 
 * Description:
 * Generates a block comment as a heading of a section or a file.
 * 
 * Usage:
 * Write a definition of the block, select it and execute 
 * or just execute and insert a definition into the shown dialog.
 * 
 * Definition of a block:
 *   - Optionally, count of bars at the top and the bottom.
 *   - Character to use as a fill.
 *   - Name of the block.
 * 
 * Examples:
 * -section
 * 0#block name
 * 2~big block of content
 * */

const MIN_BAR_LENGTH = 48;
const DEFAULT_VERTICAL_BARS = 1;

let input = CONTENT;
if (!input?.length) {
    input = await showInputDialog(
        "Insert fill character and section name, optionally with count of bars at the top and bottom as the first number (e.g. -section or 0=section):"
    );
    if (!input?.length) return;
}
const startsWithVerBars = input.match(/(^[0-9]+)(?=[^0-9])/);
const verticalBars = startsWithVerBars ? parseInt(startsWithVerBars[0], 10): DEFAULT_VERTICAL_BARS;
const barsOffset = startsWithVerBars ? startsWithVerBars[0].length: 0;
const fillChar = input.substring(barsOffset, barsOffset + 1);
const sectionName = input.substring(barsOffset + 1).toLocaleUpperCase();

const barLength = Math.max(MIN_BAR_LENGTH, sectionName.length + 2);
const indent = SELECTION.start.ch;
const startComment = LANGUAGE.match(/html|xml|svg/i) ? "<!--": "/*";
const endComment = LANGUAGE.match(/html|xml|svg/i) ? "-->": "*/";
const leftPadding = Math.floor((barLength - (sectionName.length + 2)) / 2);
const rightPadding = Math.ceil((barLength - (sectionName.length + 2)) / 2);

return `${`${" ".repeat(indent)}${startComment}${fillChar.repeat(barLength)}${endComment}\n`.repeat(verticalBars).trim()}\n${" ".repeat(indent)}${startComment}${fillChar.repeat(leftPadding)} ${sectionName} ${fillChar.repeat(rightPadding)}${endComment}${`\n${" ".repeat(indent)}${startComment}${fillChar.repeat(barLength)}${endComment}`.repeat(verticalBars)}`.trim();