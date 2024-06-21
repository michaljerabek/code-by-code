/* Get Outline From Headings
 * 
 * Description:
 * Extracts texts from HTML headings in a selection 
 * and converts them to a numbered outline.
 * 
 * Usage:
 * Select an HTML content and execute.
 * */

const $hn = $("h1, h2, h3, h4, h5, h6");

const counters = [0, 0, 0, 0, 0, 0];
const outline = $hn.toArray()
    .map((() => {
        let lastLevel = 0;
        return h => {
            const level = parseInt(h.name.match(/[1-6]/)[0], 10);
            const diff = level - lastLevel;
            const missing = [];
            if (diff > 1) {
                for (let l = 1; l < diff; l++) {
                    const $missing = $(`<h${lastLevel + l}/>`);
                    $missing.text(`--- (missing heading) ---`);
                    missing.push($missing[0]);
                }
            }
            lastLevel = level;
            return [...missing, h];
        };
    })())
    .flat()
    .map(h => {
        const text = $(h).text().replace(/\s+/g, " ").trim();
        const level = parseInt(h.name.match(/[1-6]/)[0], 10);
        counters[level - 1]++;
        for (let l = level; l < 6; l++) {
            counters[l] = 0;
        }
        const numbers = counters.slice(0, level).map(c => c || 1).join(".");
        return "  ".repeat(level - 1) + numbers + ". " + text;
    });

return outline.join("\n");