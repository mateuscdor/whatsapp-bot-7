const baileys = require('@adiwajshing/baileys')

async function main() {
    const { state } = await baileys.useMultiFileAuthState('baileys_auth_info')
    const sock = baileys.default(
        {
            auth: state
        }
    )

    sock.ev.on('messages.upsert', async ({messages}) => {
        messages.forEach((message) => {
            const textMessage = message.message.extendedTextMessage

            if (!textMessage) return

            const textData = {
                "4696278f72aef3c4963c7f19a0ba8b7a": "70902762bf46957d612f5e1f47410077",
                "dd6933598e60944ef81a8a25d9777b4d": "8876057d1ab3645ec6ed7bdb203cf498",
                "9b5e12c5412d197d686f83e60a0e10d2": "61f35c632b949f3f57c014ae36cd42a8"
            }

            console.log(textMessage.text)
            sock.sendMessage(message.key.remoteJid, {
                text: "654b09c28cbc2363ddf75d1386dd627a",
                sections: [
                    {
                        rows: 
                    }
                ]
            })
        
        })
    })
}
main()