"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../structures/Event"));
const discord_js_1 = require("discord.js");
const Utils_1 = __importDefault(require("../utils/Utils"));
const Random_1 = __importDefault(require("../utils/Random"));
const addEXP_1 = __importDefault(require("../functions/addEXP"));
const config_1 = require("../config");
const Cooldowns = new discord_js_1.Collection();
const XPCooldown = new discord_js_1.Collection();
const DiscordInviteRegex = /\b(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discordapp|discord)\.com\/invite)\/\w+[a-z]/g;
class MessageEvent extends Event_1.default {
    constructor(client) {
        super(client, 'message');
    }
    async exec(message) {
        if (message.author.bot)
            return;
        if (message.channel.type !== 'text' || !message.guild)
            return;
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
            return;
        if (!message.member)
            await message.member.fetch().catch(() => { });
        if (!XPCooldown.has(message.author.id)) {
            XPCooldown.set(message.author.id, true);
            await addEXP_1.default(this.client, message);
            this.client.setTimeout(() => XPCooldown.delete(message.author.id), 45000);
        }
        if (message.channel.id === config_1.inviteChannel) {
            await message.delete();
            if (message.content.match(DiscordInviteRegex)) {
                if (message.member.voice.channel && config_1.categories.includes(message.member.voice.channel.parentID)) {
                    const lfg = this.client.channels.cache.get(config_1.inviteChannel);
                    await message.member.voice.channel.createInvite({ maxAge: 60 * 5, reason: `[AUTO] Invite for ${message.member.voice.channel.name}` }).then((invite) => {
                        const currentChannel = this.client.channels.cache.get(message.member.voice.channel.id);
                        const inviteembed = new discord_js_1.MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor(message.author.tag + ' is looking for party members!', message.author.displayAvatarURL({ dynamic: true }))
                            .setThumbnail('https://icons-for-free.com/iconfiles/png/512/group+add+18px-131987943095875365.png')
                            .setDescription(`<:join_arrow:714395777505427516> **[Click to join their party](https://discord.gg/${invite.code})**.\n\nIf you want to make your own party, join a voice channel and type \`!invite [Party Info]\` right here.`)
                            .addField('🔊 Channel', message.member.voice.channel.name, true)
                            .addField('👥 Party Size', currentChannel.members.size + '/' + currentChannel.userLimit + ' Users', true)
                            .addField('📡 Bitrate', message.member.voice.channel.bitrate + 'kbps', true)
                            .setFooter('Post your party here. Simply do !invite or post an invite link. (INV)').setTimestamp();
                        lfg.send(inviteembed);
                    });
                }
            }
        }
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${Utils_1.default.escapeRegex(this.client.prefix)})\\s*`);
        if (!prefixRegex.test(message.content))
            return;
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = this.client.resolveCommand(commandName);
        if (!command)
            return;
        if (!Cooldowns.has(command.config.name))
            Cooldowns.set(command.config.name, new discord_js_1.Collection());
        const now = Date.now();
        const timestamps = Cooldowns.get(command.config.name);
        const cooldownAmount = (command.config.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${command.config.name}\` command.`);
            }
        }
        if (command.config.clientPermission && (!message.guild.me.permissions.has(command.config.clientPermission) || !message.channel.permissionsFor(message.guild.me).has(command.config.clientPermission)))
            return message.channel.send(`Sorry, but i need the following permisions to perform this command\n\`\`\`html\n<${command.config.clientPermission.join('> <')}>\n\`\`\``);
        if (command.config.args && !args.length && command.config.usage)
            return message.channel.send(`Sorry, You didn't provide any arguments, ${message.author}!\nThe proper usage would be:\n\`\`\`html\n${command.config.usage}\n\`\`\``);
        try {
            this.client.logger.info(`[${message.guild.name} ${message.guild.id}] (${message.author.tag} ${message.author.id}) ${command.config.name} ${args.join(' ')}`);
            const stat = await command.exec(message, args);
            if (stat !== false) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }
        catch (e) {
            const errorID = Random_1.default.string(8);
            this.client.logger.error(`Error executing command ${command.config.name} [${errorID}]\n`, e);
            message.channel.send(new discord_js_1.MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setAuthor(`Error executing command ${command.config.name}`)
                .setDescription(`Error ID: \`${errorID}\`\n\n\`\`\`xl\n${Utils_1.default.shorten(e.stack ? e.stack : '', 256)}`));
        }
    }
}
exports.default = MessageEvent;
