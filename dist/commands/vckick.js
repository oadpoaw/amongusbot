"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
const config_1 = require("../config");
class VCKick extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'vckick',
            description: `disconnects a user from your lobby (Host Only)`,
            clientPermission: [],
            cooldown: 60,
            args: true,
            usage: 'vckick <User>',
            aliases: [],
        });
    }
    async exec(message, args) {
        const user = await this.client.resolveUser(args.join(' '));
        if (message.member.voice && message.member.voice.channel && config_1.categories.includes(message.member.voice.channel.parentID) && message.member.voice.channel.permissionsFor(message.member).has('USE_VAD')) {
            if (!user)
                return message.channel.send(`That is not a valid user, pls use \`vcpardon <UserMention|Username|UserID|UserTag>\``);
            if (user.id === message.author.id)
                return message.channel.send(`you cannot do that to yourself!`);
            message.guild.member(user).voice.setChannel(null);
            await message.channel.send(`User has been disconnected from your vc!`);
        }
        else
            return message.channel.send(`You do not have the permission to do that`);
    }
}
exports.default = VCKick;
