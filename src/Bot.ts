import { Client, Collection, Message, ClientOptions } from 'discord.js';
import Command from './structures/Command';
import Logger from './utils/Logger';
import ProfileManager from './structures/ProfileManager';

export interface BotOptions {
    prefix: string;
}

export default class Bot extends Client {
    public commands: Collection<string, Command>;
    public logger: typeof Logger;
    public prefix: string;
    public profiles: ProfileManager;
    public constructor(opts: BotOptions, clientOptions: ClientOptions) {
        super(clientOptions);
        this.commands = new Collection();
        this.logger = Logger;
        this.prefix = opts.prefix;
        this.profiles = new ProfileManager();
    }
    public resolveCommand(str: string): Command | null {
        const command = this.commands.get(str) || this.commands.find((c) => c.config.aliases.includes(str));
        return command || null;
    }
    public async resolveUser(str: string) {
        if (!str || typeof str !== 'string') return null;
        let user = null;
        if (str.match(/^<@!?(\d+)>$/)) user = await this.users.fetch(str.match(/^<@!?(\d+)>$/)[1]).catch(() => { });
        if (str.match(/^!?(\w+)#(\d+)$/) && !user) user = this.users.cache.find((u) => u.username === str.match(/^!?(\w+)#(\d+)$/)[0] && u.discriminator === str.match(/^!?(\w+)#(\d+)$/)[1]);
        if (!user) user = await this.users.fetch(str).catch(() => { });
        return user || this.users.cache.find((u) => u.username === str);
    }
    public async awaitReply(message: Message, time: number = 60000): Promise<Message | boolean> {
        try {
            const collected = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time, errors: ['time'] });
            return collected.first();
        } catch (e) {
            return false;
        }
    }
}