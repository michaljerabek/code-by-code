/* Get JSON From HTML
 * 
 * Description:
 * Returns a JSON with text content from selected HTML.
 * It expects title, text and link will be in the code.
 * 
 * Usage:
 * Select an HTML content and execute.
 * 
 * Example: 
 * Select HTML like: 
   <ul>
       <li>
           <h2>Title 1</h2>
           <p>Doloribus impedit officia <a href="https://url1.com">quas in similique</a> quam beatae.</p>
       </li>
       <li>
           <h2>Title 2</h2>
           <p>Lorem ipsum dolor sit amet <a href="https://url2.com">eum minima</a>!</p>
       </li>
   </ul>
 * Execute.
 * */

const TITLE_SELECTOR = "h1, h2, h3, h4, h5, h6, dt, [class*='title'], [class*='name']";
const CONTENT_SELECTOR = "p, dd, [class*='text'], [class*='content'], [class*='desc']";
const LINK_SELECTOR = "[href]";

let $items = $.root().find("li, [class*='item'], article");
if ($items.length === 0) {
    $items = $.root().children();
    if ($items.length === 1) {
        const $children = $items.children();
        const tagName = $children[0].tagName;
        const className = $children.first().attr("class");
        if ($children.length && $children.filter(`${tagName}${className ? `[class="${className}"]`: ""}`).length === $children.length) {
            $items = $children;        
        }
    }
}

const output = $items.toArray().map(item => {
    const $item = $(item);
    const title = $item.find(TITLE_SELECTOR).first().text();
    const content = $item.find(CONTENT_SELECTOR).first().text();
    const link = $item.find(LINK_SELECTOR).first().attr("href");
    
    const returnObject = {};
    if (title) returnObject.title = title;
    if (content) returnObject.content = content;
    if (link) returnObject.link = link;
    return returnObject;
});

outputJSON(output.length === 1 ? output[0]: output);