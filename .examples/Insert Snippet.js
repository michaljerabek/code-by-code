/* Insert Snippet
 * 
 * Description:
 * Inserts a selected snippet at each cursor.
 * 
 * Usage:
 * Execute anywhere, select a snippet from the list and set
 * options if necessary. You can also write the name (or its part) 
 * of a snippet, select it and then execute.
 * 
 * In the SNIPPETS constant you can define your own snippets as:
 * { 
 *     "language[,language2, ...]": { // or "all"
 *         "Snippet Name": {
 *             args?: [
 *                 "arg", // If the name is the same as the default value
 *                 { "Label": "Default value" }
 *             ],
 *             render: ([arg, label, ...]) => String
 *         },
 *         
 *         "Snippet 2": {}
 *     },
 *     
 *     "language3": {}
 * }
 * */

const SNIPPETS = {
    "javascript": {
        "For Loop": {
            args: [
                { "Variables": "x,y,z" },
                "array",
                "item"
            ],
            render: (vars, array, item) => {
                vars = vars.split(/\s*,\s*/).filter(val => val.length);
                const arrIdx = idxs => `${idxs.map(idx => `[${idx}]`).join("")}`;
                const getForLoop = (vars, prev) => {
                    if (!vars.length) return `const ${item} = ${array}${arrIdx(prev)};`;
                    const indent = " ".repeat(prev.length * 4);
                    return `for (let ${vars[0]} = 0; ${vars[0]} < ${array}${arrIdx(prev)}.length; ${vars[0]}++) {
${indent}    ${getForLoop(vars, [...prev, vars.shift()])}
${indent}}`;
                };
                return getForLoop(vars, []);
            }
        },
    },
    
    "css,scss": {
        "Media Query": {
            args: [
                { "Width(+) | Min:Max, ...": "479,640:767,1024" }
            ],
            render: (ranges) => {
                ranges = ranges.split(/\s*,\s*/).filter(val => val.length);
                ranges = ranges.map(range => range.trim().split(/\s*:\s*/).filter(val => val.length));
                ranges = ranges.map(
                    ([m1, m2], i) => 
                        m2 ? `(min-width: ${m1}px) and (max-width: ${m2}px)`: 
                            `(${(i !== 0 && i === ranges.length - 1 || m1.match(/\+|\>/)) ? "min": "max"}-width: ${m1.replace(/\+|\>/g, "")}px)`
                );
                return `@media ${ranges.join(ranges.length > 2 ? ",\n    ": ", ")} {\n${"    ".repeat(Math.min(ranges.length, 2))}\n}`;
            }
        }
    },
    
    "html": {
        "Table": {
            args: [
                { "Rows": "3" },
                { "Columns": "3" },
                { "Header (row, col, both)": "row" },
            ],
            render: (rows, cols, header) => {
                rows = Array.from({length: !isNaN(+rows) ? +rows: 3});
                cols = Array.from({length: !isNaN(+cols) ? +cols: 3});
                return `<table>
    ${rows.map((_, row) => {
        return `<tr>
        ${cols.map((_, col) => {
            return ((header === "row" || header === "both") && row === 0) || 
                (header !== "row" && col === 0) ? `<th></th>`: `<td></td>`;
        }).join("\n        ")}
    </tr>`;                
    }).join("\n    ")}
</table>`;
            }
        }
    },
    
    "all": {
        "PI": {
            render: () => Math.PI.toString()
        },
        
        "Lorem Picsum": {
            args: [
                { "Width": "1920" },
                { "Height": "1080" },
                { "Id (100, 42, r = random)": "" }
            ],
            render: (width, height, id) => {
                return `https://picsum.photos/${id.length && !id.startsWith("r") ? `id/${id}/`: ""}${width}/${height}${id.startsWith("r") ? `?random=${Math.round(Math.random() * 1000)}`: ""}`;
            }
        }
    }
};

Object.entries(SNIPPETS).forEach(
    ([langs, snippets]) => 
        Object.entries(snippets).forEach(([name, snippet]) => {
            snippet._id = langs + "." + name;
        })
);

function getSnippetById(id) {
    return Object.values(SNIPPETS)
        .map(snippets => 
            Object.values(snippets)
                .filter(snippet => snippet._id === id)[0]
        )
        .filter(Boolean)[0];
}

function renderSnippet(snippet, args, isPreview = false) {
    try {
        return snippet.render(...args).toString();
    } catch (error) {
        return COMMAND !== "output" && isPreview ? "Error: " + error: CONTENT;
    }
}

let renderedSnippet = STORAGE.insertSnippetOptions ? 
    renderSnippet(
        getSnippetById(STORAGE.insertSnippetOptions.snippetId), 
        STORAGE.insertSnippetOptions.args
    ): 
    CONTENT;

if (!STORAGE.insertSnippetOptions) {
    const snippetsForCurrentLang = Object.keys(SNIPPETS)
        .filter(langs => langs.match(new RegExp(`\\ball|${LANGUAGE}\\b`, "i")))
        .reduce((result, langs) => Object.assign(result, SNIPPETS[langs]), {});

    if (Object.keys(snippetsForCurrentLang).length === 0) {
        return abort("No snippet found for language: " + LANGUAGE);
    }

    Object.keys(snippetsForCurrentLang).forEach(name => {
        const snippet = snippetsForCurrentLang[name];
        snippet.args = (snippet.args || []).map(arg => typeof arg === "string" ? { [arg]: arg }: arg);
    });

    const Dialogs = brackets.getModule("widgets/Dialogs");

    const dialogBtns = [
        {
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: Dialogs.DIALOG_BTN_OK,
            text: "Insert"
        },
        SELECTIONS.length - INDEX === 1 ? null: {
            id: "all",
            text: `All (${SELECTIONS.length - INDEX}/${SELECTIONS.length})`
        },
        {
            className: Dialogs.DIALOG_BTN_CLASS_LEFT,
            id: Dialogs.DIALOG_BTN_CANCEL,
            text: "Cancel"
        }
    ].filter(Boolean);

    const dialogContent = `<form id="__cbc-insert-snippet-form" style="display: grid; row-gap: 16px; margin: 0;" autocomplete="off">
        <div>
            <label class="mj-codebycode__label" for="__cbc-insert-snippet-snippet">Snippet</label>
            <select style="margin-left: 0;" name="snippet" id="__cbc-insert-snippet-snippet" autocomplete="off">
                ${Object.keys(snippetsForCurrentLang).map((name) => {
                    return `<option value="${name}">${name}</option>`;
                }).join("")}
            </select>
        </div>
        <div id="__cbc-insert-snippet-args" style="display: none; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;"></div>
        <div>
            <label class="mj-codebycode__label" style="for="__cbc-insert-snippet-output">Preview</label>
            <output id="__cbc-insert-snippet-output">
                <pre id="__cbc-insert-snippet-preview" 
                    style="max-height: 10lh; margin: 0; overflow: auto; color: inherit; user-select: text; cursor: text;
                        border-color: color-mix(in srgb, currentColor, transparent 88%);
                        background-color: color-mix(in srgb, currentColor, transparent 92%);
                "></pre>
            </output>
        </div>
    </form>`;

    let idCounter = 0;
    const getArgTemplate = name => `<div style="display: grid">
        <label class="mj-codebycode__label" for="__cbc-insert-snippet-arg-${idCounter}">${name[0].toLocaleUpperCase() + name.substring(1)}</label>
        <input style="justify-self: stretch; width: auto; min-width: 0;" 
            name="args[]" type="text" id="__cbc-insert-snippet-arg-${idCounter++}" autocomplete="off">
    </div>`;

    const dialog = Dialogs.showModalDialog("", "Code By Code: Insert Snippet", dialogContent, dialogBtns);
    const $dialog = dialog.getElement();
    const $form = $dialog.find("#__cbc-insert-snippet-form");
    const $snippet = $dialog.find("#__cbc-insert-snippet-snippet");
    const $args = $dialog.find("#__cbc-insert-snippet-args");
    const $preview = $dialog.find("#__cbc-insert-snippet-preview");

    const getSnippetData = () => {
        const formData = new FormData($form[0]);
        const snippet = snippetsForCurrentLang[formData.get("snippet")];
        const args = formData.getAll("args[]");
        return { snippet, args };
    };
    
    const updatePreview = () => {
        const { snippet, args } = getSnippetData();
        $preview.text(renderSnippet(snippet, args, true));
    };

    const updateContent = () => {
        const snippet = snippetsForCurrentLang[$snippet.val()];
        const argsTpl = snippet.args.map(arg => getArgTemplate(Object.keys(arg)[0])).join("");
        $args.html(argsTpl)
            .css("display", argsTpl.length ? "grid": "none")
            .find("input")
            .each((i, input) => { 
                input.value = Object.values(snippet.args[i])[0]; 
            });
    };

    $form.on("input.codebycode", function (event) {
        if (event.target.tagName === "SELECT") {
            updateContent();
        }
        updatePreview();
    });

    if (dialogBtns.length === 3) {
        const $ok = $dialog.find(`.dialog-button[data-button-id="${Dialogs.DIALOG_BTN_OK}"]`);
        const $all = $dialog.find(`.dialog-button[data-button-id="all"]`);
        $form.on("keydown.codebycode", event => {
            if (!event.ctrlKey) return;
            $ok.removeClass(Dialogs.DIALOG_BTN_CLASS_PRIMARY);
            $all.addClass(Dialogs.DIALOG_BTN_CLASS_PRIMARY);
        });
        $form.on("keyup.codebycode", event => {
            if (event.which === 13) return;
            $ok.addClass(Dialogs.DIALOG_BTN_CLASS_PRIMARY);
            $all.removeClass(Dialogs.DIALOG_BTN_CLASS_PRIMARY);
        });
    }

    $form.on("keyup.codebycode", "input", event => {
        if (event.which !== 13) return;
        $dialog.find(`.dialog-button.${Dialogs.DIALOG_BTN_CLASS_PRIMARY}`).click();
    });
    
    if (CONTENT) {
        const [select] = Object.keys(snippetsForCurrentLang)
            .map(name => ({ name, index: name.toLocaleLowerCase().indexOf(CONTENT.toLocaleLowerCase()) }))
            .filter(({index}) => index !== -1)
            .sort((a, b) => a.index - b.index)
            .map(({name}) => name);
        if (select) $snippet.val(select);
    }
    updateContent();
    updatePreview();
    $snippet[0].focus();

    const closedBy = await dialog.getPromise();
    $form.off(".codebycode");
    
    if (closedBy === Dialogs.DIALOG_BTN_CANCEL) {
        return CONTENT;
    }

    const { snippet, args } = getSnippetData();
    if (closedBy === "all") {
        STORAGE.insertSnippetOptions = { snippetId: snippet._id, args };
    }
    renderedSnippet = renderSnippet(snippet, args);
}

const indent = COMMAND === "output" ? 0: SELECTION.start.ch;
renderedSnippet = renderedSnippet.replace(/^/mg, " ".repeat(indent)).replace(/^\s*/, "");
return renderedSnippet;