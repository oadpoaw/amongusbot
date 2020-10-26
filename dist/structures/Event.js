"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(client, event) {
        this.client = client;
        this.name = event;
    }
    ;
    async exec(..._args) {
        this.error();
    }
    error() {
        throw new Error(`exec(...) not implemented`);
    }
}
exports.default = Event;
