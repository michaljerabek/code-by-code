/* Clean SVG From Editor
 * 
 * Description:
 * Removes unnecessary code typically added by vector
 * editors like Adobe XD or Affinity Designer using svgo[1].
 * 
 * Usage:
 * Select the content of an SVG file and execute.
 * 
 * [1] https://svgo.dev/docs/introduction/
 * */

const svgo = loadModule("svgo");
const result = svgo.optimize(CONTENT, {
    js2svg: { indent: 4, pretty: true },
    multipass: true,
    plugins: [
        "removeEditorsNSData",
        "removeDoctype",
        "removeXMLProcInst",
        "removeUnknownsAndDefaults",
        "cleanupEnableBackground",
        "removeUnusedNS",
        "removeUselessDefs",
        "removeUselessStrokeAndFill",
        "removeDesc",
        "convertStyleToAttrs",
        "collapseGroups",
        "removeComments",
        "cleanupAttrs",
        "convertColors",
        {
            name: "cleanupNumericValues",
            params: {
                floatPrecision: 5,
                leadingZero: true,
                defaultPx: true,
                convertToPx: true
            }
        },
        {
            name: "cleanupIds",
            params: {
                remove: true,
                minify: false
            }
        },
        {
            name: "removeAttrs",
            params: {
                attrs: "svg:(version|x|y)"
            }
        },
        {
            name: "removeAttrs",
            params: {
                attrs: "svg|xml:space",
                elemSeparator: "|"
            }
        },
        {
            name: "removeAttrs",
            params: {
                attrs: "svg:(width|height):100%"
            }
        },
        {
            name: "removeAttrs",
            params: {
                attrs: "*:data-.+"
            }
        }
    ]
});

if (result.error) throw result.error.toString();
return result.data;