import _ from 'lodash';
import P from 'pino';
import Path from 'path'
import core from 'file-type/core';
import { Readable } from 'form-data';
import { fromBuffer } from 'file-type';
import { ButtonConfig, Content, GetBuffer, Metadata } from './types';
import axios from 'axios';
import * as fs from 'fs';
import makeWASocket, * as baileys from '@adiwajshing/baileys';
import { eventHandler } from './event';

export default class Client {
    private static instance: Client;
    private static socket: baileys.WASocket;
    public readonly auth: ReturnType<typeof baileys.useMultiFileAuthState>;
    public readonly messageType: Record<string, string>;
    private constructor() {
        this.auth = baileys.useMultiFileAuthState('./src/database/session');
        this.messageType = Object.fromEntries(
            Object.keys(baileys.proto.Message)
                .filter((a) => a.endsWith('Message') || a.includes('Conversation'))
                .map((a) => {
                    const type = a[0].toLowerCase() + a.slice(1);
                    return [type.replace('conversation', 'text').replace('Message', ''), type];
                }),
        );
    }

    public static async connect() {
        try {
            if (!Client.instance) Client.instance = new Client();
            if (!fs.existsSync('./src/database/session')) fs.mkdirSync('./src/database/session')
            Client.socket = makeWASocket({
                auth: (await Client.instance.auth).state,
                printQRInTerminal: true,
                version: (await baileys.fetchLatestBaileysVersion({})).version,
                browser: ['Soruka Tech Bot', 'Desktop', '3.1.0'],
                logger: P({
                    level: 'info',
                }),
            });
            Promise.all([eventHandler(Client.instance)]);
            return Client.instance;
        } catch (err) {
            throw err;
        }
    }

    public get baileys() {
        return baileys;
    }
    public get socket(): baileys.WASocket {
        return Client.socket;
    }

    public async sendMessage(mess: Metadata | string, content: Content): Promise<baileys.proto.WebMessageInfo | undefined> {
        try {
            let property: Record<string, any> = content;

            const mediaType = Object.keys(property).find((v) => ['document', 'video', 'audio', 'image', 'sticker'].includes(v));
            if (!(typeof property[mediaType as keyof baileys.AnyMessageContent] === 'object') && mediaType) {
                const bufferData = await this.getBuffer(property[mediaType as keyof baileys.AnyMessageContent], true);

                if (mediaType === 'image') {
                    (property.caption as string) = property?.text ? property.text : property?.caption ? property.caption : '';
                    delete property?.text;
                }

                property = {
                    mimetype: (property?.mimetype ? property.mimetype : mediaType === 'audio' ? 'audio/mpeg' : bufferData.mime) as string,
                    fileName: (!property?.filename
                        ? `${Date.now()}.${bufferData.ext}`
                        : property?.filename.includes('.')
                            ? property.filename
                            : `${property.filename}.${bufferData.ext}`) as string,
                    ...property,
                    [mediaType]: bufferData.buffer,
                };
            }

            return this.socket.sendMessage(
                typeof mess === 'object' ? mess.from! : mess,
                property as baileys.AnyMessageContent,
                property as baileys.MiscMessageGenerationOptions,
            );
        } catch (err) {
            throw err;
        }
    }

    public async sendButton(mess: Metadata, content: Content, buttons: ButtonConfig[]): Promise<baileys.proto.WebMessageInfo | undefined> {
        try {
            let parsedType = ''

            function parseButton(type: string, object: ButtonConfig) {
                if ('listTitle' in object) {
                    parsedType = 'sections'
                    return {
                        ...object,
                        title: object.listTitle ?? undefined,
                        rowId: object.value ?? undefined
                    }
                } else if ('reply' in object) {
                    parsedType = 'buttons'
                    return {
                        buttonText: { displayText: object.reply },
                        buttonId: object.value
                    }
                } else {
                    parsedType = 'templateButtons'
                    return {
                        [type + 'Button']: {
                            displayText: object[type as keyof typeof object],
                            ['call' in object ? 'phoneNumber' : type]: object.value ?? undefined
                        }
                    }
                }
            }

            let buttonData: baileys.proto.IHydratedTemplateButton[] | baileys.proto.Message.ListMessage.ISection[] | baileys.proto.Message.ButtonsMessage.IButton[] = [];

            let rows: baileys.proto.Message.ListMessage.IRow[] = [];
            for (const bc of buttons) {
                const type = Object.keys(bc)
                    .find((v) => v !== 'value')
                    ?.toLowerCase();
                const parse = type ? parseButton(type, bc) : undefined;

                switch (parsedType) {
                    case 'sections':
                        rows.push(parse as baileys.proto.Message.ListMessage.IRow);
                        if ('title' in bc) {
                            buttonData.push({
                                rows,
                                title: (bc as any).title,
                            });
                            rows = []
                        }
                        break
                    case 'buttons':
                    case 'templateButtons':
                        buttonData.push(parse as any)
                        break
                }
            }
            
            if (!(buttons.filter((o) => {return o.hasOwnProperty("title")}).length > 0) && parsedType === 'sections') {
                buttonData.push({
                    rows
                })
            }
            if (rows.some(v => !v?.title)) throw new Error('Please atleast put 1 title when you want to send list message')
            return this.sendMessage(mess, {
                ...content,
                [parsedType]: buttonData,
                // TODO: Ketika bug button template di fix hapus ini
                viewOnce: parsedType === 'templateButtons' ? true : false,
            });
        } catch (err) {
            throw err;
        }
    }

    public reply = async (mess: Metadata, content: Content | string, buttons?: ButtonConfig[]): Promise<baileys.proto.WebMessageInfo | undefined> => {
        if (typeof content === 'object' && buttons) {
            return this.sendButton(mess, {...content, quoted: mess }, buttons)
        } else {
            return this.sendMessage(mess, { text: content, quoted: mess })
        }
    }

    public async downloadContent(mess: Metadata, path?: string) {
        try {
            const values = Object.values(this.messageType);
            const type = Object.keys(mess).find((a) => values.includes(a) && !a.includes('senderKey') && !a.includes('context'));
            if (!type) throw new Error('Message type not found');
            return this.getBuffer(
                await this.baileys.downloadContentFromMessage(
                    mess[type as keyof Metadata] as baileys.DownloadableMessage,
                    type.replace(/Message/i, '').trim() as baileys.MediaType,
                ),
                false,
                path
            );
        } catch (err) {
            throw err;
        }
    }

    public getBuffer = async (
        content: GetBuffer,
        autoFormat: boolean,
        path?: string,
    ): Promise<{
        filename?: string;
        buffer: Buffer;
        ext: core.FileExtension | 'bin';
        mime: core.MimeType | 'application/octet-stream';
    }> => {
        try {
            let buffer: Buffer;
            if (Buffer.isBuffer(content)) buffer = content;
            else if (/^data:.?\/.?;base64,/i.test(content as string)) buffer = Buffer.from((content as string).split(',')[1], 'base64');
            else if (/^https?:\/\//.test(content as string)) {
                buffer = (
                    await axios.get(
                        content as string,
                        utilities.headers({
                            responseType: 'arraybuffer',
                        }),
                    )
                )?.data;
            } else if (fs.existsSync(content as string)) buffer = fs.readFileSync(content as string);
            else if ((content as unknown as { _readableState: any })?._readableState) buffer = await this.baileys.toBuffer(content as Readable);
            else if (typeof content === 'string') buffer = Buffer.from(content);
            else buffer = Buffer.alloc(0);
            const template = (await fromBuffer(buffer)) || {
                ext: 'bin',
                mime: 'application/octet-stream',
            };

            if (path) {
                const filename = autoFormat ? `${_.last(path.split(Path.sep))}.${template.ext}` : path;
                fs.writeFileSync(autoFormat ? Path.join(path, filename) : path, buffer);
                return {
                    filename,
                    buffer,
                    ...template,
                };
            }
            return {
                buffer,
                ...template,
            };
        } catch (err) {
            throw err;
        }
    };
}