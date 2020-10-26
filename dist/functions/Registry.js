"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEvents = exports.registerCommands = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const Command_1 = __importDefault(require("../structures/Command"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Event_1 = __importDefault(require("../structures/Event"));
async function registerCommands(client) {
    const filePath = path_1.default.join(__dirname, '..', 'commands');
    const files = await fs_1.promises.readdir(filePath);
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const cc = require(path_1.default.join(filePath, file));
                if (cc.default.prototype instanceof Command_1.default) {
                    const instance = new cc.default(client);
                    client.commands.set(instance.config.name, instance);
                }
                delete require.cache[require.resolve(path_1.default.join(filePath, file))];
            }
            catch (e) {
                Logger_1.default.error(e);
            }
        }
        else if ((await fs_1.promises.lstat(path_1.default.join(filePath, file))).isDirectory()) {
            const commands = await fs_1.promises.readdir(path_1.default.join(filePath, file));
            for (const command of commands) {
                try {
                    const cc = require(path_1.default.join(filePath, file, command));
                    if (cc.default.prototype instanceof Command_1.default) {
                        const instance = new cc.default(client);
                        instance.config.category = file.split('.')[0];
                        client.commands.set(instance.config.name, instance);
                    }
                    delete require.cache[require.resolve(path_1.default.join(filePath, file, command))];
                }
                catch (e) {
                    Logger_1.default.error(e);
                }
            }
        }
    }
}
exports.registerCommands = registerCommands;
async function registerEvents(client) {
    const filePath = path_1.default.join(__dirname, '..', 'events');
    const files = await fs_1.promises.readdir(filePath);
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const event = require(path_1.default.join(filePath, file));
                if (event.default.prototype instanceof Event_1.default) {
                    const instance = new event.default(client);
                    client.on(instance.name, (...args) => instance.exec(...args));
                }
                delete require.cache[require.resolve(path_1.default.join(filePath, file))];
            }
            catch (e) {
                Logger_1.default.error(e);
            }
        }
    }
}
exports.registerEvents = registerEvents;
