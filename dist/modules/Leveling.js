"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LvlChart = [];
const ReqLvlChart = [];
const maxLevel = 200; // you can change this btw to something bigger
for (let i = 0; i <= maxLevel; i++) {
    ReqLvlChart.push(15 * (i * i) + (50 * i) + 150);
    if (i === 0)
        LvlChart.push(i);
    else if (i === 1)
        LvlChart.push(ReqLvlChart[0]);
    else if (i === 2)
        LvlChart.push(ReqLvlChart[0] + ReqLvlChart[1]);
    else
        LvlChart.push(LvlChart[i - 1] + ReqLvlChart[i - 1]);
}
class Leveling {
    static progress(percent, padding = 10, block = '■', padblock = '□') {
        return block.repeat(Math.floor(percent * (padding * .01))).padEnd(padding, padblock);
    }
    ;
}
exports.default = Leveling;
Leveling.maxLevel = maxLevel;
Leveling.LevelChart = LvlChart;
Leveling.RequireedLevelChart = ReqLvlChart;
;
