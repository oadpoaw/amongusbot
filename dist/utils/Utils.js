"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Utils {
    constructor() {
        throw new Error(`The ${this.constructor.name} class cannot be instantiated`);
    }
    static trimArray(array, maxLen = 10) {
        if (array.length < maxLen)
            return array;
        array = array.slice(0, maxLen);
        array.push(`${array.length - maxLen} more...`);
        return array;
    }
    static shorten(text, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }
    static base64(mode = 'encode', text) {
        if (mode === 'encode')
            return Buffer.from(text).toString('base64');
        if (mode === 'decode')
            return Buffer.from(text, 'base64').toString('utf8') || null;
        return null;
    }
    static hash(algorithm, text) {
        return crypto_1.createHash(algorithm).update(text).digest('hex');
    }
    static escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    static chunkArray(array, size = 0) {
        const clone = array.slice();
        return new Array(Math.ceil(clone.length / size)).fill(0).map(_ => clone.splice(0, size));
    }
    static chunkString(str, size = 0) {
        const len = Math.ceil(str.length / size);
        let offset = 0;
        return Array(len).map(_ => {
            offset += len;
            return str.substr(offset, len);
        });
    }
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    static shuffleString(str) {
        return this.shuffleArray(str.split('')).join('');
    }
}
exports.default = Utils;
