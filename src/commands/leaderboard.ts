import Command from '../structures/Command';
import Bot from '../Bot';
import { Message, MessageEmbed } from 'discord.js';
import Utils from '../utils/Utils';
import Paginate from '../functions/Paginate';

export default class Rank extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'leaderboard',
            description: `Shows the leaderboard`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'leaderboard',
            aliases: ['top'],
        });
    }
    public async exec(message: Message, args: string[]) {
        const filtered = this.client.profiles.cache.filter(p => this.client.users.cache.has(p.id));
        const sorted = filtered.sort((a, b) => b.experience - a.experience);
        const chunks = Utils.chunkArray(sorted.array(), 8);
        const profile = await this.client.profiles.fetch(message.author.id);
        const pos = sorted.array().indexOf(profile) > -1 ? sorted.array().indexOf(profile) + 1 : sorted.size + 1;
        const embeds = chunks.map((ps) => {
            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle(`Leaderboard`)
                .setDescription(`${message.author.tag}'s ranking ${pos} / ${sorted.size + 1}\n\n**Rank** - **User** - **Exp**\n${ps.map((p, i) => `${i + 1}. **${this.client.users.cache.get(p.id).tag}** - **${p.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ✨`).join('\n')}`)
            return embed;
        });
        Paginate(message, embeds);
    }
}