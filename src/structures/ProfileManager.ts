import { Collection } from 'discord.js';
import { User } from '../database/';
import Profile from './Profile';

export default class ProfileManager {
    public cache: Collection<string, Profile>;
    public constructor() {
        this.cache = new Collection();
    }
    public async fetch(id: string): Promise<Profile> {
        if (this.cache.has(id)) return this.cache.get(id);
        const inst = await User.findOne({ where: { id } });
        if (!inst) return new Profile(id, null);
        this.cache.set(id, new Profile(id, inst.toJSON()));
        return this.cache.get(id);
    }
    public async syncAll() {
        const profiles = await User.findAll();
        for (const profile of profiles) {
            const inst = profile.toJSON() as any;
            this.cache.set(inst.id, new Profile(inst.id, inst))
        }
    }
    public async delete(id: string) {
        try {
            const n = await User.destroy({ where: { id } });
            return n > 0 ? this.cache.delete(id) : false;
        } catch (e) {
            throw e;
        }
    }
}