import { ClientEvents } from 'discord.js';
import Bot from '../Bot';

export default class Event {
    public name: string;
    protected constructor(protected client: Bot, event: keyof ClientEvents) {
        this.name = event;
    };
    public async exec(..._args: any): Promise<any> {
        this.error();
    }
    private error() {
        throw new Error(`exec(...) not implemented`);
    }
}