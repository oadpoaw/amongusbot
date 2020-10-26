"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./utils/Logger"));
require("./utils/Process");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const Bot_1 = __importDefault(require("./Bot"));
const Registry_1 = require("./functions/Registry");
const config_1 = require("./config");
const client = new Bot_1.default({ prefix: config_1.prefix });
(async function () {
    await Registry_1.registerCommands(client);
    await Registry_1.registerEvents(client);
    await client.login(process.env.DISCORD_TOKEN || config_1.token);
}()).catch(Logger_1.default.error);
