import Command from '../structures/Command';
import Bot from '../Bot';
import { Message } from 'discord.js';

export default class Ping extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'ping',
            description: `Determine the bot's ping/latency to discord`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'ping',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        const msg = await message.channel.send(`Ping?`)
        try {
            await msg.edit(`Pong!\nLatency: \`${Math.round(msg.createdTimestamp - message.createdTimestamp)}ms\`.\nWebSocket API Latency :\`${Math.round(this.client.ws.ping)}ms\``);
        } catch (e) {
            throw e;
        }
    }
}