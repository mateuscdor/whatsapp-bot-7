import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
const main = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    "auth"
  );
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      if (
        (lastDisconnect?.error as Boom).output.statusCode !==
        DisconnectReason.loggedOut
      ) {
        main();
      }
    } else if (connection === 'open') {
      await sock.sendMessage("6288279564323-1627446839@g.us", {
        text: "Transaksi done 👍\nTerimakasih telah beli di Losra Store 🤗\nMau tau updatean stock & testimoni? Klik join di bawah ini\nOwner only : @Ayanecchi",
        buttons: [
          {buttonId: 'id1', buttonText: {displayText: 'Bawah ini'}, type: 1},
          {buttonId: 'id2', buttonText: {displayText: 'Join'}, type: 1},
        ],
      });
    }
    console.log('connection update', connection)
  });
  sock.ev.on("creds.update", async () => {
    await saveCreds();
  });
  sock.ev.on('messages.upsert', async ({messages}) => {
    messages.forEach(async (value) => {
      console.log(value)
    })
  })
};
main();
