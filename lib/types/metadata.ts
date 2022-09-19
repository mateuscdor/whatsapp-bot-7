import { GroupMetadata, proto } from '@adiwajshing/baileys';

export interface Metadata extends proto.IWebMessageInfo {
	sender: {
		jid?: string | null;
		name?: string | null;
		isOwner: boolean;
		isAdmin?: boolean;
	};
	client: {
		name?: string;
		jid: string;
		isAdmin?: boolean;
	};
	validator: {
		message: {
			isText: boolean;
			isMedia: boolean;
		};
		isGroup: boolean;
	};
	utilities: {
		downloadMess: (filename?: string) => ReturnType<typeof client.downloadContent>;
		deleteMess: (forAll?: boolean) => Promise<proto.WebMessageInfo | void>;
	};
	type: [string, string | undefined];
	from?: string | null;
	fromMe: boolean;
	mentionedJid?: string[];
	message?: proto.IMessage | null;
	quoted?: Metadata;
	body: {
		toString: () => string;
		data: proto.IMessage[keyof proto.IMessage];
	};
	messageKey: string[];
	groupMetadata?: GroupMetadata;
}