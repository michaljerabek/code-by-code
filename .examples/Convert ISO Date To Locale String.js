/* Convert ISO Date To Locale String
 * 
 * Description:
 * Converts a date from ISO format to a human friendly format 
 * using Date.prototype.toLocaleDateString. 
 * 
 * Usage:
 * Select a date like 2012-12-21 or 2022-02-22T22:22 and execute.
 * */

const LOCALE = "en";
const OPTIONS = {
    year: "numeric",
    month: "long",
    day: "numeric"
};
if (CONTENT.includes("T")) {
    Object.assign(OPTIONS, {
        hour: "numeric",
        minute: "numeric"
    });
}

return new Date(Date.parse(CONTENT))
    .toLocaleDateString(LOCALE, OPTIONS);