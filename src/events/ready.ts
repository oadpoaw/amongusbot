import Event from '../structures/Event';
import Bot from '../Bot';
import { User } from '../database';
import { TextChannel, MessageEmbed } from 'discord.js';

export default class Ready extends Event {
    public constructor(client: Bot) {
        super(client, 'ready');
    }
    public async exec() {
        this.client.logger.info(`Bot ready as ${this.client.user.tag} (${this.client.user.id})`);
        await this.client.profiles.syncAll();
        this.client.setInterval(async () => {
            const ldr = await User.findOne({ where: { id: 'leaderboard' } });
            if (ldr) {
                const { message_id, channel_id } = ldr.getDataValue('data');
                const channel = this.client.channels.cache.get(channel_id) as TextChannel;
                if (channel) {
                    const msg = await channel.messages.fetch(message_id);
                    if (msg) {
                        const msg = await channel.messages.fetch(message_id);
                        if (msg) {
                            const filtered = this.client.profiles.cache.filter(p => this.client.users.cache.has(p.id));
                            const sorted = filtered.sort((a, b) => b.experience - a.experience);
                            const profiles = sorted.first(20);
                            let embed = new MessageEmbed()
                                .setColor('RANDOM')
                                .setTimestamp()
                                .setTitle(`Leaderboard`)
                                .setDescription(`**Rank** - **User** - **Exp**\n${profiles.map((p, i) => `${i + 1}. **${this.client.users.cache.get(p.id).tag}** - **${p.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ✨`).join('\n')}`)
                            msg.edit(embed);
                        }
                    }
                }
            }
        }, 45000);
    }
}