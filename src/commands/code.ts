import Command from '../structures/Command';
import Bot from '../Bot';
import { Message } from 'discord.js';
import { categories } from '../config';

export default class Code extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'code',
            description: `Set game code to your discord lobby! (Host Only)`,
            clientPermission: [],
            cooldown: 120,
            args: true,
            usage: 'code <Code> [Region]',
            aliases: ['setcode'],
        });
    }
    public async exec(message: Message, args: string[]) {
        const code = args.shift();
        const region = args.shift();
        if (message.member.voice && message.member.voice.channel && categories.includes(message.member.voice.channel.parentID) && message.member.voice.channel.permissionsFor(message.member).has('USE_VAD')) {
            if (!code.match(/^[A-Z]{6,6}$/g)) return message.channel.send(`Oops, the first parameter should be a 6 letter upper ONLY`);
            if (region && !['AS', 'NA', 'EU'].includes(region)) return message.channel.send(`Oops, the second parameter should be a valid region, eg. \`AS\` for Asia, \`NA\` for North America, \`EU\` for Europe \nCaSe SeNsItIvE`);
            const name = `${message.member.voice.channel.name.split(':')[0]}:${code} ${region || ''}`;
            await message.member.voice.channel.setName(name, 'code update');
            message.channel.send(`Room has been updated!`);
        } else return message.channel.send(`You do not have the permission to do that`);
    }
}