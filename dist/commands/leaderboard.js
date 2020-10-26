"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
const discord_js_1 = require("discord.js");
const Utils_1 = __importDefault(require("../utils/Utils"));
const Paginate_1 = __importDefault(require("../functions/Paginate"));
class Rank extends Command_1.default {
    constructor(client) {
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
    async exec(message, args) {
        const filtered = this.client.profiles.cache.filter(p => this.client.users.cache.has(p.id));
        const sorted = filtered.sort((a, b) => b.experience - a.experience);
        const chunks = Utils_1.default.chunkArray(sorted.array(), 8);
        const profile = await this.client.profiles.fetch(message.author.id);
        const pos = sorted.array().indexOf(profile) > -1 ? sorted.array().indexOf(profile) + 1 : sorted.size + 1;
        const embeds = chunks.map((ps) => {
            let embed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setTitle(`Leaderboard`)
                .setDescription(`${message.author.tag}'s ranking ${pos} / ${sorted.size + 1}\n\n**Rank** - **User** - **Exp**\n${ps.map((p, i) => `${i + 1}. **${this.client.users.cache.get(p.id).tag}** - **${p.experience.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ✨`).join('\n')}`);
            return embed;
        });
        Paginate_1.default(message, embeds);
    }
}
exports.default = Rank;
