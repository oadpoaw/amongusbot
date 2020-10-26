"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Logger_1 = __importDefault(require("./utils/Logger"));
const ProfileManager_1 = __importDefault(require("./structures/ProfileManager"));
class Bot extends discord_js_1.Client {
    constructor(opts, clientOptions) {
        super(clientOptions);
        this.commands = new discord_js_1.Collection();
        this.logger = Logger_1.default;
        this.prefix = opts.prefix;
        this.profiles = new ProfileManager_1.default();
    }
    resolveCommand(str) {
        const command = this.commands.get(str) || this.commands.find((c) => c.config.aliases.includes(str));
        return command || null;
    }
    async resolveUser(str) {
        if (!str || typeof str !== 'string')
            return null;
        let user = null;
        if (str.match(/^<@!?(\d+)>$/))
            user = await this.users.fetch(str.match(/^<@!?(\d+)>$/)[1]).catch(() => { });
        if (str.match(/^!?(\w+)#(\d+)$/) && !user)
            user = this.users.cache.find((u) => u.username === str.match(/^!?(\w+)#(\d+)$/)[0] && u.discriminator === str.match(/^!?(\w+)#(\d+)$/)[1]);
        if (!user)
            user = await this.users.fetch(str).catch(() => { });
        return user || this.users.cache.find((u) => u.username === str);
    }
    async awaitReply(message, time = 60000) {
        try {
            const collected = await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time, errors: ['time'] });
            return collected.first();
        }
        catch (e) {
            return false;
        }
    }
}
exports.default = Bot;
