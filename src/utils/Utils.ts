import { createHash } from 'crypto';

export default class Utils {
    public constructor() {
        throw new Error(`The ${this.constructor.name} class cannot be instantiated`);
    }
    public static trimArray(array: any[], maxLen: number = 10): any[] {
        if (array.length < maxLen) return array;
        array = array.slice(0, maxLen);
        array.push(`${array.length - maxLen} more...`);
        return array;
    }
    public static shorten(text: string, maxLen: number = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }
    public static base64(mode: 'encode' | 'decode' = 'encode', text: string) {
        if (mode === 'encode') return Buffer.from(text).toString('base64');
        if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
        return null;
    }
    public static hash(algorithm: 'sha256' | 'md5' | 'sha1' | 'sha512', text: string) {
        return createHash(algorithm).update(text).digest('hex');
    }
    public static escapeRegex(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    public static chunkArray<T>(array: T[], size: number = 0): T[][] {
        const clone = array.slice();
        return new Array(Math.ceil(clone.length / size)).fill(0).map(_ => clone.splice(0, size));
    }
    public static chunkString(str: string, size: number = 0): string[] {
        const len = Math.ceil(str.length / size);
        let offset = 0;
        return Array(len).map(_ => {
            offset += len;
            return str.substr(offset, len);
        });
    }
    public static shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    public static shuffleString(str: string): string {
        return this.shuffleArray(str.split('')).join('');
    }
}