import path from 'path';
import { promises as fs } from 'fs';
import Bot from '../Bot';
import Command from '../structures/Command';
import Logger from '../utils/Logger';
import Event from '../structures/Event';

export async function registerCommands(client: Bot) {
    const filePath = path.join(__dirname, '..', 'commands');
    const files = await fs.readdir(filePath);
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const cc = require(path.join(filePath, file));
                if (cc.default.prototype instanceof Command) {
                    const instance: Command = new cc.default(client);
                    client.commands.set(instance.config.name, instance);
                }
                delete require.cache[require.resolve(path.join(filePath, file))];
            } catch (e) {
                Logger.error(e);
            }
        } else if ((await fs.lstat(path.join(filePath, file))).isDirectory()) {
            const commands = await fs.readdir(path.join(filePath, file));
            for (const command of commands) {
                try {
                    const cc = require(path.join(filePath, file, command));
                    if (cc.default.prototype instanceof Command) {
                        const instance: Command = new cc.default(client);
                        instance.config.category = file.split('.')[0];
                        client.commands.set(instance.config.name, instance);
                    }
                    delete require.cache[require.resolve(path.join(filePath, file, command))];
                } catch (e) {
                    Logger.error(e);
                }
            }
        }
    }
}

export async function registerEvents(client: Bot) {
    const filePath = path.join(__dirname, '..', 'events');
    const files = await fs.readdir(filePath);
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const event = require(path.join(filePath, file));
                if (event.default.prototype instanceof Event) {
                    const instance: Event = new event.default(client);
                    client.on(instance.name, (...args: any) => instance.exec(...args));
                }
                delete require.cache[require.resolve(path.join(filePath, file))];
            } catch (e) {
                Logger.error(e);
            }
        }
    }
}