/* Format Number As Currency
 * 
 * Description:
 * Converts a number to currency format using built-in Intl object. 
 * 
 * Usage:
 * Select a number parsable by JavaScript and execute.
 * */

const LOCALE = "en-US";
const OPTIONS = { 
    style: "currency", 
    currency: "USD" 
};

return new Intl.NumberFormat(LOCALE, OPTIONS)
    .format(parseFloat(CONTENT));