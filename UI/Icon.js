/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";
    
    const { TITLE, NS, COMMAND, COMMAND_NAME } = require("CONSTANTS");
    const CommandManager = brackets.getModule("command/CommandManager");

    const ID = {
        icon: NS + "__icon",
    };
    let $icon = $("<a>");
    
    exports.getIcon = function getIcon() {
        return $icon;
    };
    
    exports.addIcon = function addIcon(commands) {
        $icon.attr({
                id: ID.icon,
                href: "#",
                title: `${TITLE}
${Object.entries(commands).map(([key, cmd]) => {
    return `${key.replace(/_/g, "+")}: ${COMMAND_NAME[cmd]}`;
}).join("\n")}`
            })
            .css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
                textDecoration: "none",
                color: "#bbb"
            })
            .appendTo($("#main-toolbar .buttons"));
        $icon.html("<span style='padding-bottom: 2px'>$</span>");
        
        $icon.on("click." + NS, event => {
            event.preventDefault();
            const { ctrlKey, altKey, shiftKey } = event;
            switch (true) {
                case !!(ctrlKey && altKey && shiftKey && commands.CTRL_ALT_SHIFT):
                    return CommandManager.execute(commands.CTRL_ALT_SHIFT);
                case !!(ctrlKey && altKey && commands.CTRL_ALT):
                    return CommandManager.execute(commands.CTRL_ALT);
                case !!(ctrlKey && shiftKey && commands.CTRL_SHIFT):
                    return CommandManager.execute(commands.CTRL_SHIFT);
                case !!(altKey && shiftKey && commands.ALT_SHIFT):
                    return CommandManager.execute(commands.ALT_SHIFT);
                case !!(ctrlKey && commands.CTRL):
                    return CommandManager.execute(commands.CTRL);
                case !!(altKey && commands.ALT):
                    return CommandManager.execute(commands.ALT);
                default: CommandManager.execute(COMMAND.OPEN_MAIN_UI);
            }
        });
    };
});