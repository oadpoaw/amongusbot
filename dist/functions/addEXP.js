"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = __importDefault(require("../utils/Random"));
async function addEXP(client, message) {
    const user = await client.profiles.fetch(message.author.id);
    const lastlevel = user.level;
    const nextlevel = user.nextlevel;
    user.experience += Random_1.default.int(20, 10);
    const level = user.level;
    if (nextlevel === level)
        await message.channel.send(`GG! ${message.author} you leveled up from **${lastlevel}** to **${level}** !`);
    await user.save();
}
exports.default = addEXP;
