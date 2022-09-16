import makeWaSocket, { useMultiFileAuthState } from '@adiwajshing/baileys'
import MAIN_LOGGER from '@adiwajshing/baileys/lib/Utils/logger'

const logger = MAIN_LOGGER.child({ })
logger.level = 'trace'

const main = async() => {
    const { state } = await useMultiFileAuthState('baileys_auth_info')
    const sock = makeWaSocket(
        {
            auth: state,
            logger,
            printQRInTerminal: true
        }
    )
    sock.ev.process( async(events) => {
        const messageUpsert = events['messages.upsert']
        console.log(messageUpsert)
        if (messageUpsert && messageUpsert.type === 'notify') {
            for (const msg of messageUpsert.messages) {
                const conversation = msg.message?.conversation
                if (conversation?.toLowerCase() === 'p') {
                    const sections = [
                        {
                            rows: [
                                {
                                    title: "Bagaimana cara saya memesan?"
                                },
                                {
                                    title: "Saya memiliki kendala"
                                },
                                {
                                    title: "Barang tidak sampai"
                                }
                            ]
                        }
                    ]
                    const listMessage = {
                        text: "Hai, ada yang bisa kami bantu?",
                        buttonText: "FAQ",
                        sections
                    }

                    const sendMsg = await sock.sendMessage(msg.key.remoteJid!, listMessage)
                    console.log(msg)
                    console.log(sendMsg)
                } else if (conversation === "Bagaimana cara saya memesan?") {
                    await sock.sendMessage(msg.key.remoteJid!, { text: "Anda bisa langsung memesan dengan ..." })
                } else if (conversation === "Saya memiliki kendala") {
                    await sock.sendMessage(msg.key.remoteJid!, { text: "Jika anda memiliki kendala, silahkan hubungi ..." })
                } else if (conversation === "Barang tidak sampai") {
                    await sock.sendMessage(msg.key.remoteJid!, { text: "Anda bisa menghubungi ..." })
                }
            }
        }
    })
}

main()