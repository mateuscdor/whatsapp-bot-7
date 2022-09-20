import NodeCache from 'node-cache';
import Client from './client';
import config from '../src/config.json'
import Database from './database';
import * as fs from 'fs'
import * as utilities from './utilities'
import commandHandler from './command';
import path from 'path';
import * as dotenv from 'dotenv'
dotenv.config({path: './src/.env'});

(async function () {
    try {
        globalThis.nodeCache = new NodeCache({ useClones: false, stdTTL: 43200 });
        globalThis.client = await Client.connect();
        globalThis.config = config;
        globalThis.database = await Database.connect();
        globalThis.utilities = utilities
        globalThis.command = new commandHandler()

        for (const fn of fs.readdirSync(path.join('./lib/commands')))
            if (!fn.endsWith('d.ts') && fn.endsWith(process.env.NODE_ENV === 'production' ? 'js' : 'ts')) await import(`./commands/${fn}`);
        return void 0;
    } catch (err) {
        throw err;
    }
})()