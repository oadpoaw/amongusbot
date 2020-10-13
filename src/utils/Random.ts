export default class Random {
    public constructor() {
        throw new Error(`This ${this.constructor.name} class cannot be instantiated`);
    }
    public static int(max: number = 100, min: number = 0) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    public static string(length: number = 10, chars: string[] = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789']) {
        return [...Array(length)].map(() => chars[Math.random() * chars.length | 0]).join('');
    }
}