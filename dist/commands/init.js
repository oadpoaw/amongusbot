"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
const database_1 = require("../database/");
class Ping extends Command_1.default {
    constructor(client) {
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
    async exec(message, args) {
        if (message.member.permissions.has('MANAGE_GUILD')) {
            const msg = await message.channel.send('Loading Leaderboard...');
            const ldr = await database_1.User.findOne({ where: { id: 'leaderboard' } });
            if (ldr)
                await database_1.User.update({ data: { channel_id: msg.channel.id, message_id: msg.id } }, { where: { id: 'leaderboard' } });
            else
                await database_1.User.create({ id: 'leaderboard', data: { channel_id: msg.channel.id, message_id: msg.id } });
        }
        else
            message.reply(`you dont have the permission to do that`);
    }
}
exports.default = Ping;
