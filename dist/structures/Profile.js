"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Leveling_1 = __importDefault(require("../modules/Leveling"));
const database_1 = require("../database/");
class Profile {
    constructor(id, raw) {
        this.id = id;
        this.id = id;
        raw = Object.assign({
            data: {
                experience: 0,
            }
        }, raw || {});
        const { data } = raw;
        this.experience = data.experience;
    }
    get level() {
        for (let i = 0; i <= Leveling_1.default.maxLevel; i++)
            if (this.experience >= Leveling_1.default.LevelChart[i] && this.experience <= Leveling_1.default.LevelChart[i + 1])
                return i;
    }
    get levelxp() {
        return Leveling_1.default.LevelChart[this.level];
    }
    get nextlevel() {
        return this.level + 1;
    }
    get nextlevelxp() {
        return Leveling_1.default.LevelChart[this.nextlevel];
    }
    get progress() {
        return ((this.experience - this.levelxp) / (this.nextlevelxp - this.levelxp)) * 100; // (xp - lxp / nxp - lxp) * 100 = n
    }
    get progressbar() {
        return Leveling_1.default.progress(this.progress, 15);
    }
    get progressXP() {
        return this.nextlevelxp - this.experience;
    }
    async save() {
        const user = await database_1.User.findOne({ where: { id: this.id } });
        if (user)
            await database_1.User.update(this.toJSON(), { where: { id: this.id } });
        else
            await database_1.User.create(this.toJSON());
    }
    toJSON() {
        return {
            id: this.id,
            data: {
                experience: this.experience,
            }
        };
    }
}
exports.default = Profile;
