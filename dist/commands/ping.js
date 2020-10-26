"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../structures/Command"));
class Ping extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: `Determine the bot's ping/latency to discord`,
            clientPermission: [],
            cooldown: 3,
            args: false,
            usage: 'ping',
            aliases: [],
        });
    }
    async exec(message, args) {
        const msg = await message.channel.send(`Ping?`);
        await msg.edit(`Pong!\nLatency: \`${Math.round(msg.createdTimestamp - message.createdTimestamp)}ms\`.\nWebSocket API Latency :\`${Math.round(this.client.ws.ping)}ms\``);
    }
}
exports.default = Ping;
