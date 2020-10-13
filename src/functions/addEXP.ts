import Bot from '../Bot';
import { Message } from 'discord.js';
import Random from '../utils/Random';

export default async function addEXP(client: Bot, message: Message) {
    const user = await client.profiles.fetch(message.author.id);
    const lastlevel = user.level;
    const nextlevel = user.nextlevel;
    user.experience += Random.int(20, 10);
    const level = user.level;
    if (nextlevel === level) await message.channel.send(`GG! ${message.author} you leveled up from **${lastlevel}** to **${level}** !`);
    await user.save();
}