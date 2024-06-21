/* Fetch From API And Insert Into HTML
 * 
 * Description:
 * Fetches data from an API and inserts them in a selected HTML 
 * template according to properties of the returned JSON 
 * and classes and ids of elements.  
 * 
 * Usage:
 * Select an HTML template and execute. 
 * Example:
 * <h2 class="title">title property from JSON<h2>
 * <p class="description">description property from JSON<p>
 */

const response = await fetch("https://dummyjson.com/products/" + (INDEX + 1));
const data = await response.json();
if (!data) throw "Data fetching failed!";

Object.entries(data)
    .forEach(([key, value]) => $(`[class*="${key}"], [id*="${key}"]`).text(value));