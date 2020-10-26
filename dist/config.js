"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.inviteChannel = exports.moderatorRole = exports.findChannel = exports.createChannel = exports.token = exports.prefix = void 0;
const config_json_1 = require("./config.json");
exports.prefix = config_json_1.prefix;
exports.token = config_json_1.bottoken;
exports.createChannel = config_json_1.createChannel;
exports.findChannel = config_json_1.findChannel;
exports.moderatorRole = config_json_1.moderatorRole;
exports.inviteChannel = config_json_1.inviteChannel;
exports.categories = config_json_1.categories;