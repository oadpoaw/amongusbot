"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
const discord_js_1 = require("discord.js");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
class HelpMe extends Command_1.default {
    constructor(client) {
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
    async exec(message, args) {
        if (args.length) {
            const command = this.client.resolveCommand(args.join(' '));
            if (command) {
                return message.channel.send(new discord_js_1.MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`${command.config.name} Command`)
                    .setDescription(command.config.description)
                    .addField(`Usage`, `\`${command.config.usage}\``)
                    .addField(`Cooldown`, pretty_ms_1.default(command.config.cooldown * 1000), true));
            }
        }
        return message.channel.send(new discord_js_1.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ dynamic: true }))
            .addField(`Commands`, `\`${this.client.commands.map((c) => c.config.name).join('\`, \`')}\``)
            .setFooter(`!help [Command]`));
    }
}
exports.default = HelpMe;
