import makeWASocket, {
	useMultiFileAuthState,
	DisconnectReason,
    delay
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
const main = async () => {
	const { state, saveCreds } = await useMultiFileAuthState("whatsapp_profile/Freshbox");
	const sock = makeWASocket({ auth: state, printQRInTerminal: true });
	sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
		if (connection === "close") {
			if (
				(lastDisconnect?.error as Boom).output.statusCode !==
				DisconnectReason.loggedOut
			) {
				main();
			} else {
				console.log("Logged out.");
			}
		} else if (connection === 'open') {
			// Do something while the connection is opened.
		}
	});
	sock.ev.on("creds.update", async () => {
		await saveCreds();
	});
    sock.ev.process(async (events) => {
        console.log(JSON.stringify(events));
    });
	sock.ev.on("messages.upsert", async ({ messages }) => {
		messages.forEach(async ({ key }) => {
			if (key.fromMe) return;
			
			// List message test
			await sock.sendMessage(key.remoteJid!, {
				text: "This is a list",
				footer: "nice footer, link: https://google.com",
				title: "Amazing boldfaced list title",
				buttonText: "Required, text on the button to view the list",
				sections: [
					{
						title: "Section 1",
						rows: [
							{ title: "Option 1", rowId: "option1" },
							{
								title: "Option 2",
								rowId: "option2",
								description: "This is a description",
							},
						],
					},
					{
						title: "Section 2",
						rows: [
							{ title: "Option 3", rowId: "option3" },
							{
								title: "Option 4",
								rowId: "option4",
								description: "This is a description V2",
							},
						],
					},
				],
			});
		});
	});
};
main();