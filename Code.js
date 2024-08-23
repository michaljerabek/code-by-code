/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    const { HAS_NODE, CONFIG, OPTIONS, CODE_CMD_PREFIX } = require("CONSTANTS");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const CommandManager = brackets.getModule("command/CommandManager");
    const KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    const Options = require("Options");
    const onDirChangeEventIDs = {};
    const onCommandCreatedFns = [];

    exports.onDirChange = function onDirChange(source, fn) {
        onDirChangeEventIDs[source] = onDirChangeEventIDs[source] ?? Date.now().toString(36);
        FileSystem.on("change." + onDirChangeEventIDs[source], async (event, item) => {
            if (item?.parentPath?.startsWith(source) || item?.fullPath?.startsWith(source)) {
                fn(await exports.getFromDir(source));
            }
        });
    };

    exports.offDirChange = function offDirChange(source) {
        FileSystem.off("change." + onDirChangeEventIDs[source]);
    };
    
    exports.getItemByPath = async function getItemByPath(path) {
        const file = FileSystem.getFileForPath(path);
        return new Promise(resolve => {
            file.read({}, (err, content) => {
                const env = (file.parentPath || "").endsWith("/node/") ? OPTIONS.ENV_NODE: OPTIONS.ENV_PHOENIX;
                resolve({
                    name: file.name?.replace(/.js$/, ""),
                    path: file.fullPath || "",
                    env: env,
                    code: content || ""
                });
            });
        });
    };
    
    exports.getFromDir = async function getFromDir(path) {
        const data = await Promise.all([
            new Promise(resolve => {
                FileSystem.getDirectoryForPath(path)
                    .getContents((err, files) => {
                        if (err) return resolve([]);
                        resolve(
                            files.filter(file => file.isFile)
                                .filter(file => file.name.match(/\.js$/))
                                .map(file => ({
                                    name: file.name.replace(/\.js$/, ""),
                                    path: file.fullPath,
                                    env: OPTIONS.ENV_PHOENIX
                                }))
                        );
                    });
            }),
            new Promise(resolve => {
                if (!HAS_NODE) return resolve([]);
                FileSystem.getDirectoryForPath(`${path}/node`)
                    .getContents((err, files) => {
                        if (err) return resolve([]);
                        resolve(
                            files.filter(file => file.isFile)
                                .filter(file => file.name.match(/\.js$/))
                                .map(file => ({
                                    name: file.name.replace(/\.js$/, ""),
                                    path: file.fullPath,
                                    env: OPTIONS.ENV_NODE
                                }))
                        );
                    });
            })
        ]);
        return data.flat();
    };

    exports.onGlobalChange = function onGlobalChange(fn) {
        Options.onChange(CONFIG.CODE_GLOBAL, fn);
    };

    exports.getGlobal = function getGlobal() {
        return Options.get(CONFIG.CODE_GLOBAL) || [];
    };
    
    exports.getItemByName = function getItemByName(source, name) {
        return source.filter(item => item.name === name)[0] || null;
    };
    
    exports.getGlobalItemByName = function getGlobalItemByName(name) {
        return exports.getItemByName(exports.getGlobal(), name);
    };
    
    exports.onCommandCreated = function onCommandCreated(fn) {
        onCommandCreatedFns.push(fn);
    };
    
    exports.createCommand = function createCommand(name) {
        const item = exports.getGlobalItemByName(name);
        if (!item) return null;
        
        let cmd = name.split(/\s+/).map(word => word.replace(/[^a-zA-Z0-9_-]/g, ""))
            .map((word, i) => (word[0] || "")[i ? "toUpperCase": "toLowerCase"]() + (word.substring(1) || "").toLowerCase())
            .join("");
        cmd = CODE_CMD_PREFIX + "." + (cmd?.trim() || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36).substring(0, 8));
        exports.saveGlobalItem(item.name, item.code, cmd, item.env);
        
        const updatedItem = exports.getGlobalItemByName(name);
        if (updatedItem?.cmd) {
            onCommandCreatedFns.forEach(fn => fn(updatedItem));
            return cmd;
        }
        return null;
    };
    
    function removeKeyBindingToCommand(cmd) {
        const command = CommandManager.get(cmd);
        if (!command) return;
        
        command.setEnabled(false);
        const [keyBinding] = KeyBindingManager.getKeyBindings(command);
        if (keyBinding) {
            KeyBindingManager.showShortcutSelectionDialog(command);
            const $remove = $(`.change-shortcut-dialog [data-button-id="remove"]:visible`);
            if ($remove.length) {
                $remove.click();
            } else {
                $(`.change-shortcut-dialog [data-button-id="cancel"]`).click();
            }
        }
    }
    
    exports.removeCommand = function removeCommand(name) {
        const item = exports.getGlobalItemByName(name);
        if (!item?.cmd) return;
        exports.saveGlobalItem(item.name, item.code, "", item.env);
        removeKeyBindingToCommand(item.cmd);
    };
    
    exports.saveGlobalItem = function saveGlobalItem(name, code, cmd, env = OPTIONS.ENV_PHOENIX) {
        if (!name || !code) return;
        const savedCode = exports.getGlobal();
        const savedItem = exports.getItemByName(savedCode, name);
        if (savedItem) {
            const update = { code, env };
            if (typeof cmd === "string") update.cmd = cmd;
            Object.assign(savedItem, update);
            Options.set(CONFIG.CODE_GLOBAL, savedCode);
        } else {
            const newItem = { name, env, code };
            if (typeof cmd === "string") newItem.cmd = cmd;
            Options.set(CONFIG.CODE_GLOBAL, [newItem, ...savedCode]);
        }
    };
    
    exports.removeGlobalItem = function removeGlobalItem(name) {
        if (!name) return;
        const savedCode = exports.getGlobal();
        const savedIndex = savedCode.findIndex(item => item.name === name);
        if (savedIndex > -1) {
            const savedItem = savedCode[savedIndex];
            if (savedItem.cmd) {
                removeKeyBindingToCommand(savedItem.cmd);
            }
            savedCode.splice(savedIndex, 1);
            Options.set(CONFIG.CODE_GLOBAL, [...savedCode]);
        }
    };
});
