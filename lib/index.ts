import NodeCache from 'node-cache';
import Client from './client';
import config from '../src/config.json'
import Database from './database';
import * as fs from 'fs'
import * as utilities from './utilities'
import commandHandler from './command';
import path from 'path';
import * as dotenv from 'dotenv'
import { ProcessMode } from './types';
dotenv.config({ path: './src/.env' });

(async function () {
    try {
        const args: Array<ProcessMode | string> = process.argv
            .slice(2)
            .filter((v) => v.startsWith('--'))
            .map((v) => v.replace('--', ''));
        if (args.some((v) => v === 'dev')) process.env.NODE_ENV = 'dev';
        else process.env.NODE_ENV = 'production';

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