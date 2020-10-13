import Command from '../structures/Command';
import Bot from '../Bot';
import { Message } from 'discord.js';
import { categories } from '../assets/config';

export default class VCPardon extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'vcpardon',
            description: `Unban/pardon a user from your lobby (Host Only)`,
            clientPermission: [],
            cooldown: 60,
            args: true,
            usage: 'vcpardon <User>',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        const user = await this.client.resolveUser(args.join(' '));
        if (message.member.voice && message.member.voice.channel && categories.includes(message.member.voice.channel.parentID) && message.member.voice.channel.permissionsFor(message.member).has('USE_VAD')) {
            if (!user) return message.channel.send(`That is not a valid user, pls use \`vcpardon <UserMention|Username|UserID|UserTag>\``);
            if (user.id === message.author.id) return message.channel.send(`you cannot do that to yourself!`);
            await message.member.voice.channel.updateOverwrite(user, {
                CONNECT: true,
            });
            await message.channel.send(`User has been vc pardoned!`);
        } else return message.channel.send(`You do not have the permission to do that`);
    }
}