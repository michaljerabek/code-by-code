/* Add Dimensions To Img Element
 * 
 * Description:
 * Adds width and height attributes to an img element based on
 * its src attribute.
 * 
 * Usage:
 * Select an img element with src attribute and execute.
 * */

isAsync = true;

const $img = $("img");
const srcAttr = $img.attr("src")?.trim();
if (!srcAttr) {
    outputString("No src attribute found!");
    return done();
}

const isAbsolute = srcAttr.match(/^https?:\/\//i) !== null;
const isRootRelative = !isAbsolute && srcAttr.match(/^\//) !== null;
let fullSrc = isAbsolute ? srcAttr: 
    path.resolve(
        isRootRelative ? PROJECT_DIR: FILE_DIR,
        isRootRelative ? srcAttr.replace(/^\//, ""): srcAttr
    );

const imgSrc = await new Promise(resolve => {
    if (isAbsolute) return resolve(fullSrc);
    
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const imageFile = FileSystem.getFileForPath(fullSrc);
    const isSVG = imageFile.name?.endsWith(".svg");
    const contentType = "data:image" + (isSVG ? "/svg+xml": "") + ";base64,";
    imageFile.read({ encoding: fs.BYTE_ARRAY_ENCODING }, (err, content) => {
        if (err) {
            outputString(`Reading file ${srcAttr} failed! ` + err.toString());
            done();
        }
        const base64 = window.btoa(
            new Uint8Array(content)
                .reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        resolve(contentType + base64);
    });
});

const img = new Image();
img.onerror = () => { 
    outputString(`Loading file ${srcAttr} failed!`); 
    done(); 
};
img.onload = () => {
    $img.attr({ 
        width: img.naturalWidth, 
        height: img.naturalHeight 
    });
    done();
};
img.src = imgSrc;
img.crossOrigin = "Anonymouse";