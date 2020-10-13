import Command from '../structures/Command';
import Bot from '../Bot';
import { Message, MessageEmbed } from 'discord.js';

export default class Rank extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'rank',
            description: `Shows your rank`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'rank [User]',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        let target = await this.client.resolveUser(args.join(' ')) || message.author;
        if (!target || target.bot) target = message.author;
        const profile = await this.client.profiles.fetch(target.id);
        const profiles = this.client.profiles.cache.sort((a, b) => b.experience - a.experience);
        const size = profiles.size;
        const pos = profiles.array().indexOf(profile) > -1 ? profiles.array().indexOf(profile) + 1 : size + 1;
        message.channel.send(new MessageEmbed()
            .setAuthor(`${target.tag}'s ranking`, target.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .addField(`Ranking`, `**${pos}** / ${size + 1}`, true)
            .addField(`Experience`, `**${profile.experience}** ✨`, true)
            .addField(`Level`, `**${profile.level}**`, true)
            .addField(`Progress`, `[**${profile.progressbar}**](https://oadpoaw.xyz/)\n${Math.floor(profile.progress)}% - ${profile.progressXP} remaining`, true)
        );
    }
}