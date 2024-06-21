/* Convert Color To HSL
 * 
 * Description:
 * Converts CSS color to HSL format using tinycolor2[1].
 * 
 * Usage:
 * Select a color in HEX or RGB or a CSS named color and execute.
 * 
 * [1] https://github.com/bgrins/TinyColor
 */

const tinycolor = loadModule("tinycolor2");
const color = tinycolor(CONTENT);
return color.toHslString();