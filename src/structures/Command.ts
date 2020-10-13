import Bot from '../Bot';
import { PermissionString, Message } from 'discord.js';

export default class Command {
    protected constructor(protected client: Bot, public config: Config) { }
    public async exec(_message: Message, _args: string[]): Promise<any> {
        return this.error();
    }
    private error() {
        throw new Error(`exec(...) not implemented`);
    }
}

export interface Config {
    name: string;
    description: string;
    clientPermission: PermissionString[];
    aliases: string[];
    cooldown: number;
    args: boolean;
    usage: string;
    category?: string;
}