import Command from '../structures/Command';
import Bot from '../Bot';
import { Message, MessageEmbed } from 'discord.js';
import ms from 'pretty-ms';

export default class HelpMe extends Command {
    public constructor(client: Bot) {
        super(client, {
            name: 'help',
            description: `Help command`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'help [Command]',
            aliases: [],
        });
    }
    public async exec(message: Message, args: string[]) {
        if (args.length) {
            const command = this.client.resolveCommand(args.join(' '));
            if (command) {
                return message.channel.send(new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${command.config.name} Command`)
                    .setDescription(command.config.description)
                    .addField(`Usage`, `\`${command.config.usage}\``)
                    .addField(`Cooldown`, ms(command.config.cooldown * 1000), true)
                );
            }
        }
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true }))
            .addField(`Commands`, `\`${this.client.commands.map((c) => c.config.name).join('\`, \`')}\``)
            .setFooter(`!help [Command]`)
        );
    }
}