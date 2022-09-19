import NodeCache from 'node-cache';
import Client from '../client';
import Config from '../../src/config.json'
import Database from '../database';
import * as Utilities from '../utilities'
import commandHandler from '../command';

declare global {
    interface String {
        normalizeJid: () => string;
    }
    var nodeCache: NodeCache;
    var client: Client;
    var config: typeof Config;
    var database: Database;
    var utilities: typeof Utilities;
    var command: commandHandler;
}