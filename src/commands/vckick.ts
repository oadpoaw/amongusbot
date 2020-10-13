import Command from '../structures/Command';
import Bot from '../Bot';
import { Message } from 'discord.js';
import { categories } from '../assets/config';

export default class VCKick extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'vckick',
            description: `disconnects a user from your lobby (Host Only)`,
            clientPermission: [],
            cooldown: 3,
            args: true,
            usage: 'vckick <User>',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        const user = await this.client.resolveUser(args.join(' '));
        if (message.member.voice && message.member.voice.channel && categories.includes(message.member.voice.channel.parentID) && message.member.voice.channel.permissionsFor(message.member).has('USE_VAD')) {
            if (!user) return message.channel.send(`That is not a valid user, pls use \`vcpardon <UserMention|Username|UserID|UserTag>\``);
            if (user.id === message.author.id) return message.channel.send(`you cannot do that to yourself!`);
            message.guild.member(user).voice.setChannel(null);
            await message.channel.send(`User has been vc pardoned!`);
        } else return message.channel.send(`You do not have the permission to do that`);
    }
}