/* SVG Styles To Attributes
 * 
 * Description:
 * Converts attributes from style attributes and style 
 * elements to SVG attributes using svgo[1].
 * 
 * Usage:
 * Select the content of an SVG file and execute.
 * 
 * [1] https://svgo.dev/docs/introduction/
 * */

const svgo = loadModule("svgo");
const result = svgo.optimize(CONTENT, {
    js2svg: { indent: 4, pretty: true },
    plugins: [
        {
            name: "inlineStyles",
            params: {
                onlyMatchedOnce: false,
                removeMatchedSelectors: true
            }
        },
        "convertStyleToAttrs"
    ]
});

if (result.error) throw result.error.toString();
return result.data;