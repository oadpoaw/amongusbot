"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
process.on('unhandledRejection', Logger_1.default.error);
process.on('uncaughtException', Logger_1.default.error);
process.on('warning', Logger_1.default.warn);
