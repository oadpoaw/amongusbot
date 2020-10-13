import Logger from './utils/Logger';
import './utils/Process';
import { config } from 'dotenv';
config();

import Bot from './Bot';
import { registerCommands, registerEvents } from './functions/Registry';
import { Intents } from 'discord.js';

const client = new Bot({ prefix: '!' }, {
    ws: {
        intents: Intents.ALL,
    }
});

(async function () {
    await registerCommands(client);
    await registerEvents(client);
    await client.login();
}()).catch(Logger.error);