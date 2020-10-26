import Logger from './utils/Logger';
import './utils/Process';
import { config } from 'dotenv';
config();

import Bot from './Bot';
import { registerCommands, registerEvents } from './functions/Registry';
import { token, prefix } from './config';

const client = new Bot({ prefix });

(async function () {
    await registerCommands(client);
    await registerEvents(client);
    await client.login(process.env.DISCORD_TOKEN || token);
}()).catch(Logger.error);