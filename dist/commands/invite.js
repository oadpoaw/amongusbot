"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
class Invite extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'invite',
            description: `Invite some users to your among us game!`,
            clientPermission: [],
            cooldown: 300,
            args: false,
            usage: 'invite [Party Info]',
            aliases: [],
        });
    }
    async exec(message, args) {
        if (message.channel.id === config_1.inviteChannel) {
            if (!message.member.voice || !message.member.voice.channel) {
                await message.delete();
                await message.channel.send('Hey! You need to be in a lobby voice channel to invite others!').then((msg) => { msg.delete({ timeout: 3000 }); });
            }
            if (message.member.voice.channel.full) {
                return message.channel.send('Hey! Your voice channel is full!').then((msg) => { msg.delete({ timeout: 3000 }); });
            }
            let invite = await message.member.voice.channel.createInvite({ maxAge: 60 * 5 });
            const currentChannel = this.client.channels.cache.get(message.member.voice.channel.id);
            let inviteembed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(message.author.tag + ' is looking for party members!', message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail('https://icons-for-free.com/iconfiles/png/512/group+add+18px-131987943095875365.png')
                .setDescription(`<:join_arrow:714395777505427516> **[Click to join their party](https://discord.gg/${invite.code})**.\n\nIf you want to make your own party, join a voice channel and type \`!invite [Party Info]\` right here.`)
                .addField('🔊 Channel', message.member.voice.channel.name, true)
                .addField('👥 Party Size', currentChannel.members.size + '/' + currentChannel.userLimit + ' Users', true)
                .addField('📡 Bitrate', message.member.voice.channel.bitrate + 'kbps', true)
                .setFooter('Post your party here. Simply do !invite or post an invite link. (CMD)').setTimestamp();
            if (args.length) {
                const desc = args.join(' ');
                const info = desc.length > 64 ? desc.substr(0, 64) : desc;
                inviteembed.addField(` ℹ️ Party Info`, info, false);
            }
            message.channel.send(inviteembed);
        }
        else
            return message.channel.send(`Hey! Use this command in <#${config_1.inviteChannel}>.`).then((msg) => { msg.delete({ timeout: 10000 }); });
    }
}
exports.default = Invite;
