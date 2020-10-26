"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("../database/");
const Profile_1 = __importDefault(require("./Profile"));
class ProfileManager {
    constructor() {
        this.cache = new discord_js_1.Collection();
    }
    async fetch(id) {
        if (this.cache.has(id))
            return this.cache.get(id);
        const inst = await database_1.User.findOne({ where: { id } });
        if (!inst)
            return new Profile_1.default(id, null);
        this.cache.set(id, new Profile_1.default(id, inst.toJSON()));
        return this.cache.get(id);
    }
    async syncAll() {
        const profiles = await database_1.User.findAll();
        for (const profile of profiles) {
            const inst = profile.toJSON();
            this.cache.set(inst.id, new Profile_1.default(inst.id, inst));
        }
    }
    async delete(id) {
        try {
            const n = await database_1.User.destroy({ where: { id } });
            return n > 0 ? this.cache.delete(id) : false;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = ProfileManager;
