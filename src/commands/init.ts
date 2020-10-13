import Command from '../structures/Command';
import Bot from '../Bot';
import { Message } from 'discord.js';
import { User } from '../database/';

export default class Ping extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'init',
            description: `init`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'init',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        if (message.member.permissions.has('MANAGE_GUILD')) {
            const msg = await message.channel.send('Loading Leaderboard...');
            const ldr = await User.findOne({ where: { id: 'leaderboard' } });
            if (ldr) await User.update({ data: { channel_id: msg.channel.id, message_id: msg.id } }, { where: { id: 'leaderboard' } });
            else await User.create({ id: 'leaderboard', data: { channel_id: msg.channel.id, message_id: msg.id } });
        } else message.reply(`you dont have the permission to do that`);
    }
}