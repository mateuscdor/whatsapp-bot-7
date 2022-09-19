import { Boom } from "@hapi/boom";
import Client from "./client";
import metadata from "./metadata";

export async function eventHandler(client: Client) {
    client.socket.ev.on('creds.update', async () => (await client.auth).saveCreds())

    client.socket.ev.on('connection.update', (condition) => {
        switch (condition.connection) {
            case 'open':
                break
            case 'close':
                const statusCode = (condition.lastDisconnect?.error as Boom).output.statusCode;
                if (statusCode !== client.baileys.DisconnectReason.loggedOut) Client.connect();
                else process.exit();
                break;
        }
    })

    client.socket.ev.on('messages.upsert', async (ev) => {
        if (!Object.keys(ev.messages[0]).includes('message') || !Object.keys(ev.messages[0]).includes('key')) return;

        if (!database.storage?.chats) database.storage.chats = {};
        if (!database.storage?.chatsId) database.storage.chatsId = [];

        const mess = await metadata(ev.messages[0]);
        if (mess.type[0] === 'protocolMessage') client.socket.ev.emit('messages.delete', { keys: [mess.message?.protocolMessage?.key!] });
        if (mess.key.id!.length < 20 || mess.from === 'status@broadcast') return;

        nodeCache.set(mess.key.id!, mess);
        // TODO: Remove isGroup validator
        if (!utilities._.has(database.storage.chats, mess.from!) && mess.validator.isGroup) database.storage.chats[mess.from!] = {};
        if (!database.storage.chatsId.includes(mess.from)) database.storage.chatsId.push(mess.from);

        return Promise.all([client.socket.readMessages([mess.key]), command.emit(mess)]);
    });

    client.socket.ev.on('call', async (ev) => {
        const v = ev[0];

        if (!(v.status === 'offer')) return;

        await client.socket.sendNode({
            tag: 'call',
            attrs: {
                from: client.socket.user?.id!,
                to: v.from,
                id: client.socket.generateMessageTag(),
            },
            content: [
                {
                    tag: 'reject',
                    attrs: {
                        'call-id': v.id,
                        'call-creator': v.from,
                        count: '0',
                    },
                    content: undefined,
                },
            ],
        });
    });

    return void 0;
}