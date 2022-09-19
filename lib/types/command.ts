import { Metadata } from "./metadata";

export namespace ICommandHandler {
    export interface Event extends config {
        name: string;
        command: {
            string: string[];
            regExp: RegExp[];
        };
        tag: string[];
        index: number | null;
        callback: (mess: Metadata, property: CommandProperty) => Promise<any> | any;
    }

    export interface config {
        prefix: boolean
    }

    export interface CommandProperty {
        instance: Event;
        text: string;
        query: string;
        command: string;
        commandWithQuery: string;
        prefix: string;
    }
}

export interface EventParser {
    prefix: RegExp;
    index: number;
    commandWithQuery: string;
    command: string;
}