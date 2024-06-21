/* Generate React Component
 * 
 * Description:
 * Generates basic template for React component named
 * as the name of the file or as a selected text.
 * 
 * Usage:
 * Create and save a new file and execute or write a name
 * of the component, select it and execute.
 */

let name = CONTENT.trim();
name ||= FILE_NAME.replace(/\..+$/, "");
name = name.trim().split(/\s+|-+|_+/g)
    .map(part => part[0].toUpperCase() + part.substring(1))
    .join("");

return `import React from "react";

function ${name}() {
    return (
        <div>${name}</div>
    );
}

export default ${name};`;