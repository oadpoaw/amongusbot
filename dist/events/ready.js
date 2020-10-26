"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../structures/Event"));
const database_1 = require("../database");
const discord_js_1 = require("discord.js");
class Ready extends Event_1.default {
    constructor(client) {
        super(client, 'ready');
    }
    async exec() {
        this.client.logger.info(`Bot ready as ${this.client.user.tag} (${this.client.user.id})`);
        await this.client.profiles.syncAll();
        this.client.setInterval(async () => {
            const ldr = await database_1.User.findOne({ where: { id: 'leaderboard' } });
            if (ldr) {
                const { message_id, channel_id } = ldr.getDataValue('data');
                const channel = this.client.channels.cache.get(channel_id);
                if (channel) {
                    const msg = await channel.messages.fetch(message_id);
                    if (msg) {
                        const msg = await channel.messages.fetch(message_id);
                        if (msg) {
                            const filtered = this.client.profiles.cache.filter(p => this.client.users.cache.has(p.id));
                            const sorted = filtered.sort((a, b) => b.experience - a.experience);
                            const profiles = sorted.first(20);
                            let embed = new discord_js_1.MessageEmbed()
                                .setColor('RANDOM')
                                .setTimestamp()
                                .setTitle(`Leaderboard`)
                                .setDescription(`**Rank** - **User** - **Exp**\n${profiles.map((p, i) => `${i + 1}. **${this.client.users.cache.get(p.id).tag}** - **${p.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ✨`).join('\n')}`);
                            msg.edit(embed);
                        }
                    }
                }
            }
        }, 45000);
    }
}
exports.default = Ready;
