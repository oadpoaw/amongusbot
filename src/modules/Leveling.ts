const LvlChart: number[] = [];
const ReqLvlChart: number[] = [];
const maxLevel = 200;

for (let i = 0; i <= maxLevel; i++) {
    ReqLvlChart.push(15 * (i * i) + (50 * i) + 150);
    if (i === 0) LvlChart.push(i);
    else if (i === 1) LvlChart.push(ReqLvlChart[0]);
    else if (i === 2) LvlChart.push(ReqLvlChart[0] + ReqLvlChart[1]);
    else LvlChart.push(LvlChart[i - 1] + ReqLvlChart[i - 1]);
}

export default class Leveling {
    public static maxLevel: typeof maxLevel = maxLevel;
    public static LevelChart: typeof LvlChart = LvlChart;
    public static RequireedLevelChart: typeof ReqLvlChart = ReqLvlChart;
    public static progress(percent: number, padding: number = 10, block: string = '■', padblock: string = '□'): string {
        return block.repeat(Math.floor(percent * (padding * .01))).padEnd(padding, padblock);
    };
};