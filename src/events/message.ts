import Event from '../structures/Event';
import Bot from '../Bot';
import { Message, MessageEmbed, Collection, VoiceChannel, TextChannel } from 'discord.js';
import Utils from '../utils/Utils';
import Random from '../utils/Random';
import addEXP from '../functions/addEXP';
import { inviteChannel, categories } from '../assets/config';

const Cooldowns = new Collection<string, Collection<string, number>>();
const XPCooldown = new Collection<string, any>();
const DiscordInviteRegex = /\b(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|(discordapp|discord)\.com\/invite)\/\w+[a-z]/g;

export default class MessageEvent extends Event {
    public constructor(client: Bot) {
        super(client, 'message');
    }
    public async exec(message: Message) {
        if (message.author.bot) return;
        if (message.channel.type !== 'text' || !message.guild) return;
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) return;
        if (!message.member) await message.member.fetch().catch(() => { });
        if (!XPCooldown.has(message.author.id)) {
            XPCooldown.set(message.author.id, true);
            await addEXP(this.client, message);
            this.client.setTimeout(() => XPCooldown.delete(message.author.id), 45000);
        }
        if (message.channel.id === inviteChannel) {
            await message.delete();
            if (message.content.match(DiscordInviteRegex)) {
                if (message.member.voice.channel && categories.includes(message.member.voice.channel.parentID)) {
                    const lfg = this.client.channels.cache.get(inviteChannel) as TextChannel;
                    await message.member.voice.channel.createInvite({ maxAge: 60 * 5, reason: `[AUTO] Invite for ${message.member.voice.channel.name}` }).then((invite) => {
                        const currentChannel = this.client.channels.cache.get(message.member.voice.channel.id) as VoiceChannel;
                        const inviteembed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor(message.author.tag + ' is looking for party members!', message.author.displayAvatarURL({ dynamic: true }))
                            .setThumbnail('https://icons-for-free.com/iconfiles/png/512/group+add+18px-131987943095875365.png')
                            .setDescription(`<:join_blue:757455451662188656> **[Click to join their party](https://discord.gg/${invite.code})**.\n\nIf you want to make your own party, join a voice channel and type \`!invite [Party Info]\` right here.`)
                            .addField('🔊 Channel', message.member.voice.channel.name, true)
                            .addField('<:crewmate_black:722206583542513815> Party Size', currentChannel.members.size + '/' + currentChannel.userLimit + ' Users', true)
                            .addField('<:vent:714575432237711380> Bitrate', message.member.voice.channel.bitrate + 'kbps', true)
                            .setFooter('Post your party here. Simply do !invite or post an invite link. (INV)').setTimestamp();
                        lfg.send(inviteembed);
                    });
                }
            }
        }
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${Utils.escapeRegex(this.client.prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = this.client.resolveCommand(commandName);
        if (!command) return;
        if (!Cooldowns.has(command.config.name)) Cooldowns.set(command.config.name, new Collection());
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
        if (command.config.clientPermission && (!message.guild.me.permissions.has(command.config.clientPermission) || !message.channel.permissionsFor(message.guild.me).has(command.config.clientPermission))) return message.channel.send(`Sorry, but i need the following permisions to perform this command\n\`\`\`html\n<${command.config.clientPermission.join('> <')}>\n\`\`\``);
        if (command.config.args && !args.length && command.config.usage) return message.channel.send(`Sorry, You didn't provide any arguments, ${message.author}!\nThe proper usage would be:\n\`\`\`html\n${command.config.usage}\n\`\`\``)
        try {
            this.client.logger.info(`[${message.guild.name} ${message.guild.id}] (${message.author.tag} ${message.author.id}) ${command.config.name} ${args.join(' ')}`);
            const stat: any = await command.exec(message, args);
            if (stat !== false) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        } catch (e) {
            const errorID = Random.string(8);
            this.client.logger.error(`Error executing command ${command.config.name} [${errorID}]\n`, e);
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setAuthor(`Error executing command ${command.config.name}`)
                .setDescription(`Error ID: \`${errorID}\`\n\n\`\`\`xl\n${Utils.shorten(e.stack ? e.stack : '', 256)}`)
            );
        }
    }
}
