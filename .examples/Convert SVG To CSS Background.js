/* Convert SVG To CSS Background
 * 
 * Description:
 * Converts an SVG image to be usable inside CSS as a background-image. 
 * 
 * Usage:
 * Select an SVG content and execute.
 * */

function addNameSpace(data) {
    return data.indexOf("http://www.w3.org/2000/svg") > -1 ? data:
        data.replace(/<svg/g, "<svg xmlns='http://www.w3.org/2000/svg'");
}

function encodeSVG(data) {
    return data.replace(/"/g, "'")
        .replace(/>\s{1,}</g, "><")
        .replace(/\s{2,}/g, " ")
        .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
}

return `background-image: url("data:image/svg+xml,${encodeSVG(addNameSpace(CONTENT))}");`;