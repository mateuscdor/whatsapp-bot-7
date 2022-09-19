import { Metadata } from "./types";
import { EventParser, ICommandHandler } from "./types/command";

export default class commandHandler {
    commandList: ICommandHandler.Event[];
    tag: Record<string, ICommandHandler.Event[]>;
    prefix: RegExp[];
    constructor() {
        this.commandList = [];
        this.tag = {};
        this.prefix = config.prefix.map((v) => (typeof v === 'string' ? new RegExp(`^(${utilities.parseRegex(v)})`, 'i') : v));
    }

    public on = (command: (string | RegExp)[], tag: string[], callback: (mess: Metadata, property: ICommandHandler.CommandProperty) => Promise<any> | any, config?: ICommandHandler.config): void => {
        const event: ICommandHandler.Event = {
            name: command.map((v) => (typeof v === 'string' ? v : v.toString())).join('/'),
            command: {
                string: command.map((v) => (typeof v === 'string' ? v : v.toString())),
                regExp: command.map((v) =>
                    typeof v === 'string' ? new RegExp(`^(${utilities.parseRegex(v)})`, 'i') : v,
                ),
            },
            tag,
            prefix: true,
            index: null,
            callback,
            ...config
        };

        for (const k of tag) {
            this.tag[k] = this.tag[k] ? this.tag[k] : [];
            this.tag[k].push(event);
        }

        event.index = this.commandList.length;
        this.commandList.push(event)
    }

    public emit = (mess: Metadata) => {
        const event = this.getCommand(utilities._.deburr(mess.body.toString()));
        try {
            if (!event) return;
            event.instance.callback(mess, {
                ...event,
            });
            return event;
        } catch (err) {
            throw err;
        }
    };

    private getCommand = (text: string) => {
        const eventParser = (event: ICommandHandler.Event): EventParser | undefined => {
            const prefix: RegExp | undefined = event.prefix
                ? this.prefix.filter((v) => v.test(text)).sort((a, b) => b.toString().length - a.toString().length)[0]
                : /^()/i,
                index = event.index!,
                commandWithQuery = text.replace(prefix, ''),
                command = event.command.regExp.find((v) => v.test(commandWithQuery))?.exec(commandWithQuery);
            if (!prefix || !command) return undefined;
            return { prefix, index, commandWithQuery, command: (command as RegExpExecArray)[0] };
        };

        const parser: EventParser[] = [];
        let instance: ICommandHandler.Event | ICommandHandler.Event[] = this.commandList.filter((v) => {
            const validEvent = eventParser(v);
            if (validEvent) parser.push(validEvent);
            return validEvent;
        });
        const parsedEvent = parser.find(
            (v) =>
                v.command ===
                utilities.closest(
                    text,
                    parser.map((v) => v.command),
                ),
        );
        if (!parsedEvent || !instance) return undefined;
        instance = instance.find((v) => v.index === parsedEvent.index)!;
        return {
            instance,
            text,
            command: parsedEvent.command,
            commandWithQuery: parsedEvent.commandWithQuery,
            query: parsedEvent.commandWithQuery.replace(parsedEvent.command, '').trim(),
            prefix: parsedEvent.prefix.exec(text)![0],
            modify: (property: ICommandHandler.Event) => {
                utilities._.assign(this.commandList[(instance as typeof property).index!], property);
                return this.commandList[(instance as typeof property).index!];
            },
        };
    };
}