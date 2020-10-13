import moment from 'moment';

export default class Logger {
    public constructor() {
        throw new Error(`The ${this.constructor.name} class cannot be instantiated`);
    }
    public static info(...message: any) { console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [INFO]`, ...message) };
    public static error(...message: any) { console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [ERROR]`, ...message) }
    public static trace(...message: any) { console.trace(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [TRACE]`, ...message) }
    public static warn(...message: any) { console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [WARNING]`, ...message) }
    public static debug(...message: any) { console.debug(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [DEBUG]`, ...message) }
}