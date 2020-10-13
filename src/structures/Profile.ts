import Leveling from '../modules/Leveling';
import { User } from '../database/';

export default class Profile {
    public experience: number;
    public constructor(public id: string, raw: Schema) {
        this.id = id;
        raw = Object.assign({
            data: {
                experience: 0,
            }
        }, raw || {});
        const { data } = raw;
        this.experience = data.experience;
    }
    public get level(): number {
        for (let i = 0; i <= Leveling.maxLevel; i++) if (this.experience >= Leveling.LevelChart[i] && this.experience <= Leveling.LevelChart[i + 1]) return i;
    }
    public get levelxp(): number {
        return Leveling.LevelChart[this.level];
    }
    public get nextlevel(): number {
        return this.level + 1;
    }
    public get nextlevelxp(): number {
        return Leveling.LevelChart[this.nextlevel];
    }
    public get progress(): number {
        return ((this.experience - this.levelxp) / (this.nextlevelxp - this.levelxp)) * 100; // (xp - lxp / nxp - lxp) * 100 = n
    }
    public get progressbar(): string {
        return Leveling.progress(this.progress, 15);
    }
    public get progressXP(): number {
        return this.nextlevelxp - this.experience;
    }
    public async save() {
        const user = await User.findOne({ where: { id: this.id } });
        if (user) await User.update(this.toJSON(), { where: { id: this.id } });
        else await User.create(this.toJSON());
    }
    public toJSON(): Schema {
        return {
            id: this.id,
            data: {
                experience: this.experience,
            }
        };
    }
}

export interface Schema {
    id?: string;
    data?: Data;
}

export interface Data {
    experience: number;
}