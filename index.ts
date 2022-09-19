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
            const id = '6285161250608@s.whatsapp.net' // the WhatsApp ID 
            // send a simple text!
            const buttons = [
                {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
                {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
                {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1},
                {buttonId: 'id4', buttonText: {displayText: 'Button 4'}, type: 1},
                {buttonId: 'id5', buttonText: {displayText: 'Button 5'}, type: 1}
              ]
              
              const buttonMessage = {
                  text: "Hi it's button message",
                  footer: 'Hello World',
                  buttons: buttons,
                  headerType: 1
              }

            await sock.sendMessage(id, buttonMessage)
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
            
            
			// await sock.sendMessage(key.remoteJid!, {
			// 	text: "This is a list",
			// 	footer: "nice footer, link: https://google.com",
			// 	title: "Amazing boldfaced list title",
			// 	buttonText: "Required, text on the button to view the list",
			// 	sections: [
			// 		{
			// 			title: "Section 1",
			// 			rows: [
			// 				{ title: "Option 1", rowId: "option1" },
			// 				{
			// 					title: "Option 2",
			// 					rowId: "option2",
			// 					description: "This is a description",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			title: "Section 2",
			// 			rows: [
			// 				{ title: "Option 3", rowId: "option3" },
			// 				{
			// 					title: "Option 4",
			// 					rowId: "option4",
			// 					description: "This is a description V2",
			// 				},
			// 			],
			// 		},
			// 	],
			// });
		});
	});
};
main();