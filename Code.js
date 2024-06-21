/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    const { HAS_NODE, CONFIG, OPTIONS } = require("CONSTANTS");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const Options = require("Options");
    const onDirChangeEventIDs = {};

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
        exports.getItemByName(exports.getGlobal(), name);
    };
    
    exports.saveGlobalItem = function saveGlobalItem(name, code, env = OPTIONS.ENV_PHOENIX) {
        if (!name || !code) return;
        const savedCode = exports.getGlobal();
        const savedItem = exports.getItemByName(savedCode, name);
        if (savedItem) {
            Object.assign(savedItem, { code, env });
            Options.set(CONFIG.CODE_GLOBAL, savedCode);
        } else {
            const newItem = { name, env, code };
            Options.set(CONFIG.CODE_GLOBAL, [newItem, ...savedCode]);
        }
    };
    
    exports.removeGlobalItem = function removeGlobalItem(name) {
        if (!name) return;
        const savedCode = exports.getGlobal();
        const savedIndex = savedCode.findIndex(item => item.name === name);
        if (savedIndex > -1) {
            savedCode.splice(savedIndex, 1);
            Options.set(CONFIG.CODE_GLOBAL, [...savedCode]);
        }
    };
});
