"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class Logger {
    constructor() {
        throw new Error(`The ${this.constructor.name} class cannot be instantiated`);
    }
    static info(...message) { console.log(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}] [INFO]`, ...message); }
    ;
    static error(...message) { console.error(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}] [ERROR]`, ...message); }
    static trace(...message) { console.trace(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}] [TRACE]`, ...message); }
    static warn(...message) { console.warn(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}] [WARNING]`, ...message); }
    static debug(...message) { console.debug(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}] [DEBUG]`, ...message); }
}
exports.default = Logger;
