/* Optimize SVG
 * 
 * Description:
 * Optimizes SVG using svgo[1].
 * 
 * Usage:
 * Select the content of an SVG file and execute.
 * 
 * [1] https://svgo.dev/docs/introduction/
 * */

const PRETTY = false;
const svgo = loadModule("svgo");
const result = svgo.optimize(CONTENT, {
    js2svg: { indent: 4, pretty: PRETTY },
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {}
            }
        },
    ]
});

if (result.error) throw result.error.toString();
return result.data;