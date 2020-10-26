"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function Paginate(message, pages, opts = { time: 100000, authorOnly: true }) {
    let page = 0;
    const curPage = await message.channel.send(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true })));
    if (pages.length === 1)
        return;
    await curPage.react('⏪');
    await curPage.react('⛔');
    await curPage.react('⏩');
    const { time, authorOnly } = opts;
    const reactionCollector = curPage.createReactionCollector((reaction, user) => ['⏪', '⛔', '⏩'].includes(reaction.emoji.name) && !user.bot && (authorOnly && user.id === message.author.id), { time });
    reactionCollector.on('collect', async (reaction) => {
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
}
exports.default = Paginate;
;
