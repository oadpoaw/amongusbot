import Command from '../structures/Command';
import Bot from '../Bot';
import { Message, MessageEmbed, VoiceChannel } from 'discord.js';
import { inviteChannel } from '../assets/config';

export default class Invite extends Command {
    public constructor(client: Bot) {
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
    public async exec(message: Message, args: string[]) {
        if (message.channel.id === inviteChannel) {
            if (!message.member.voice || !message.member.voice.channel) {
                await message.delete();
                await message.channel.send('Hey! You need to be in a lobby voice channel to invite others!').then((msg) => { msg.delete({ timeout: 3000 }); });
            }
            if (message.member.voice.channel.full) {
                return message.channel.send('Hey! Your voice channel is full!').then((msg) => { msg.delete({ timeout: 3000 }); });
            }
            let invite = await message.member.voice.channel.createInvite({ maxAge: 60 * 5 });
            const currentChannel = this.client.channels.cache.get(message.member.voice.channel.id) as VoiceChannel;
            let inviteembed = new MessageEmbed()
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
        } else return message.channel.send(`Hey! Use this command in <#${inviteChannel}>.`).then((msg) => { msg.delete({ timeout: 10000 }); });
    }
}