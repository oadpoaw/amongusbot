import {
    prefix as a0,
    createChannel as a, 
    findChannel as b, 
    moderatorRole as c, 
    inviteChannel as d,
    categories as e,
    bottoken,
}  from './config.json';

export const prefix = a0;
export const token = bottoken;
export const createChannel = a;
export const findChannel = b;
export const moderatorRole = c;
export const inviteChannel = d;
export const categories: string[] = e as any;