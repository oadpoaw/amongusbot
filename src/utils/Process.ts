import Logger from './Logger';

process.on('unhandledRejection', Logger.error);
process.on('uncaughtException', Logger.error);
process.on('warning', Logger.warn);