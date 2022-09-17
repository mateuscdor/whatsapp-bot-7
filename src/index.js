const baileys = require('@adiwajshing/baileys')

async function main() {
    const { state } = await baileys.useMultiFileAuthState('baileys_auth_info')
    const sock = baileys.default(
        {
            auth: state
        }
    )

    sock.ev.on('messages.upsert', async (upsert) => {
        console.log(JSON.stringify(upsert, null, 4))

        const messages = upsert.messages
        
        messages.forEach((message) => {
            const textMessage = message.message.extendedTextMessage
            const listResponse = message.message.listResponseMessage

            const textData = {
                "4696278f72aef3c4963c7f19a0ba8b7a": "70902762bf46957d612f5e1f47410077",
                "dd6933598e60944ef81a8a25d9777b4d": "8876057d1ab3645ec6ed7bdb203cf498",
                "9b5e12c5412d197d686f83e60a0e10d2": "61f35c632b949f3f57c014ae36cd42a8"
            }

            if (listResponse) {
                console.log(listResponse, 'true1')
                const listResult = textData[listResponse.title]

                if (listResult) {
                    sock.sendMessage(message.key.remoteJid, {
                        text: listResult
                    })
                }
            } else if (textMessage) {
                if (textMessage.text.toLowerCase() === "p") {
                    sock.sendMessage(message.key.remoteJid, {
                        text: "654b09c28cbc2363ddf75d1386dd627a",
                        buttonText: "e3a610ff928705d70b4757add19880f9",
                        sections: [
                            {
                                rows: Object.keys(textData).map((value) => ({title: value}))
                            }
                        ]
                    })
                }
            }
        
        })
    })
}
main()