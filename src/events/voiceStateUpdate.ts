import Event from '../structures/Event';
import Bot from '../Bot';
import { VoiceState, Collection, CategoryChannel, VoiceChannel } from 'discord.js';
import { createChannel, findChannel, categories, moderatorRole } from '../assets/config';

let blocked = false;
const cooldowns = new Collection<string, boolean>();

export default class voiceStateUpdate extends Event {
    public constructor(client: Bot) {
        super(client, 'voiceStateUpdate');
    }
    async exec(oldState: VoiceState, newState: VoiceState) {
        if (oldState.channel) {
            if (categories.includes(oldState.channel.parentID)) {
                if (oldState.channel.members.size === 0) {
                    await oldState.channel.edit({
                        name: oldState.channel.name.split(':')[0],
                        permissionOverwrites: [
                            {
                                id: this.client.user.id,
                                allow: ['MANAGE_CHANNELS', 'CONNECT', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                            },
                            {
                                id: oldState.guild.roles.everyone,
                                deny: ['CONNECT', 'VIEW_CHANNEL'],
                            }
                        ]
                    }).catch(this.client.logger.error);
                }
                if (oldState.channel.members.size && oldState.channel.permissionOverwrites.has(oldState.member.id) && oldState.channel.permissionsFor(oldState.member).has('USE_VAD')) {
                    const host = oldState.channel.members.random();
                    await oldState.channel.edit({
                        name: oldState.channel.name.split(':')[0],
                        permissionOverwrites: [
                            {
                                id: newState.guild.roles.everyone,
                                allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'VIEW_CHANNEL'],
                                deny: ['STREAM']
                            },
                            {
                                id: host.id,
                                allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'USE_VAD', 'VIEW_CHANNEL'],
                                deny: ['STREAM']
                            },
                            {
                                id: moderatorRole,
                                allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'VIEW_CHANNEL'],
                                deny: ['STREAM']
                            },
                            {
                                id: this.client.user.id,
                                allow: ['MANAGE_CHANNELS', 'CONNECT', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                            },
                        ]
                    });
                }
            }
        }
        if (newState.channel) {
            if ([createChannel, findChannel].includes(newState.channelID)) {
                if (!blocked && !cooldowns.has(newState.member.id)) {
                    blocked = true;
                    cooldowns.set(newState.member.id, true);
                    this.client.setTimeout(() => blocked = false, 1500);
                    this.client.setTimeout(() => cooldowns.delete(newState.member.id), 10000);
                    const channels = this.client.channels.cache.filter(c => c.type === 'voice') as Collection<string, VoiceChannel>;
                    if (newState.channelID === createChannel) {
                        const findChannel = channels.find(c => categories.includes(c.parentID) && !c.members.size);
                        if (findChannel) {
                            const vc = await findChannel.overwritePermissions([
                                {
                                    id: newState.guild.roles.everyone,
                                    allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'VIEW_CHANNEL'],
                                    deny: ['STREAM']
                                },
                                {
                                    id: newState.member.id,
                                    allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'USE_VAD', 'VIEW_CHANNEL'],
                                    deny: ['STREAM']
                                },
                                {
                                    id: moderatorRole,
                                    allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'VIEW_CHANNEL'],
                                    deny: ['STREAM']
                                },
                                {
                                    id: this.client.user.id,
                                    allow: ['MANAGE_CHANNELS', 'CONNECT', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                                },
                            ]).catch(this.client.logger.error);
                            if (vc) await newState.setChannel(vc).catch(this.client.logger.error);
                            else await newState.setChannel(null).catch(this.client.logger.error);
                        } else {
                            let category = this.client.channels.cache.get(categories[0]) as CategoryChannel;
                            for (let i = 0; i < categories.length; i++) {
                                if (category.children.size < 10) break;
                                else category = this.client.channels.cache.get(categories[i]) as CategoryChannel;
                            }
                            let roomNumber = 1;
                            while (true) {
                                if (channels.find(c => c.name.includes(`Room ${roomNumber}`))) roomNumber++;
                                else break;
                            }
                            if (category.children.size !== 10) {
                                const channel = await newState.guild.channels.create(`Room ${roomNumber}`, {
                                    type: 'voice',
                                    parent: category,
                                    userLimit: 10,
                                    permissionOverwrites: [
                                        {
                                            id: newState.guild.roles.everyone,
                                            allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'VIEW_CHANNEL'],
                                            deny: ['STREAM']
                                        },
                                        {
                                            id: newState.member.id,
                                            allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'USE_VAD', 'VIEW_CHANNEL'],
                                            deny: ['STREAM']
                                        },
                                        {
                                            id: moderatorRole,
                                            allow: ['CONNECT', 'CREATE_INSTANT_INVITE', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'VIEW_CHANNEL'],
                                            deny: ['STREAM']
                                        },
                                        {
                                            id: this.client.user.id,
                                            allow: ['MANAGE_CHANNELS', 'CONNECT', 'VIEW_CHANNEL', 'MANAGE_ROLES'],
                                        },
                                    ]
                                }).catch(this.client.logger.error);
                                if (channel) await newState.setChannel(channel).catch(this.client.logger.error);
                                else await newState.setChannel(null).catch(this.client.logger.error);
                            }
                        }
                    } else await newState.setChannel(null).catch(this.client.logger.error);
                    if (newState.channelID === findChannel) {
                        const findChannel = channels.find(c => {
                            const overwrites = c.permissionOverwrites.get(newState.guild.roles.everyone.id);
                            return overwrites && overwrites.allow.has(['CONNECT']) && categories.includes(c.parentID) && c.members.size < 10 && c.members.size > 0 && (c.members.size < 5 || c.members.size < 10);
                        });
                        if (findChannel) await newState.setChannel(findChannel).catch(this.client.logger.error);
                        else await newState.setChannel(null).catch(this.client.logger.error);
                    }
                }
            }
        }
    }
}