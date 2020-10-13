import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';

export interface PaginationOptions {
	time: number;
	authorOnly: boolean;
}

export default async function Paginate(message: Message, pages: MessageEmbed[], opts: PaginationOptions = { time: 100000, authorOnly: true }) {
	let page = 0;
	const curPage: Message = await message.channel.send(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true })));
	if (pages.length === 1) return;
	await curPage.react('⏪');
	await curPage.react('⛔');
	await curPage.react('⏩');
	const { time, authorOnly } = opts;
	const reactionCollector = curPage.createReactionCollector(
		(reaction: MessageReaction, user: User) => ['⏪', '⛔', '⏩'].includes(reaction.emoji.name) && !user.bot && (authorOnly && user.id === message.author.id),
		{ time }
	);
	reactionCollector.on('collect', async (reaction: MessageReaction) => {
		await reaction.users.remove(message.author).catch(() => { });
		switch (reaction.emoji.name) {
			case '⏪':
				page = page > 0 ? --page : pages.length - 1;
				break;
			case '⛔':
				reactionCollector.stop('idk');
				break;
			case '⏩':
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		await curPage.edit(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true })));
	});
	reactionCollector.on('end', () => curPage.reactions.removeAll().catch(() => { }));
};