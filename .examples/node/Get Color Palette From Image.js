/* Get Color Palette From Image
 * 
 * Description:
 * Extracts colors from an image using colorthief[1] 
 * and returns them as CSS rgb() colors. 
 * 
 * Usage:
 * Select an URL of an image and execute. Relative URLs
 * are relative to the current file or to the current project
 * directory if they start with "/".
 * 
 * [1] https://lokeshdhakar.com/projects/color-thief/
 * */

const COLORS_COUNT = 5;

const path = require("path");
const ColorThief = loadModule("colorthief");

const isAbsolute = CONTENT.match(/^https?:\/\//i) !== null;
const isRootRelative = !isAbsolute && CONTENT.match(/^\//) !== null;
const src = isAbsolute ? 
    CONTENT: 
    path.resolve(
        isRootRelative ? PROJECT_DIR: FILE_DIR,
        isRootRelative ? CONTENT.replace(/^\//, ""): CONTENT
    );

const palette = await ColorThief.getPalette(src, COLORS_COUNT);
return palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`).join("\n");