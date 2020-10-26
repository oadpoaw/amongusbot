"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, config) {
        this.client = client;
        this.config = config;
    }
    async exec(_message, _args) {
        return this.error();
    }
    error() {
        throw new Error(`exec(...) not implemented`);
    }
}
exports.default = Command;
