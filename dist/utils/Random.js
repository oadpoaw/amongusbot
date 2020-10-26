"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Random {
    constructor() {
        throw new Error(`This ${this.constructor.name} class cannot be instantiated`);
    }
    static int(max = 100, min = 0) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static string(length = 10, chars = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789']) {
        return [...Array(length)].map(() => chars[Math.random() * chars.length | 0]).join('');
    }
}
exports.default = Random;
