import makeWASocket, {useMultiFileAuthState, DisconnectReason} from "@adiwajshing/baileys";
import { Boom } from '@hapi/boom'

const main = async function() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')
    const sock = makeWASocket(
        {
            auth: state,
            printQRInTerminal: true
        }
    )
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        
        if(connection === 'close') {
            if ((lastDisconnect?.error as Boom).output.statusCode !== DisconnectReason.loggedOut) {
                main()
            } else {
                console.log('Logged out.')
            }
        }
    })
    sock.ev.on('creds.update', async () => {
        await saveCreds()
    })
}

main();