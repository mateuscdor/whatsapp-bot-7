command.on(['hey'], ['command'], (mess) => {
    return client.sendButton(mess, {
        text: "Selamat datang di Jasa Websiteku. Jasa pembuatan website dengan support terbaik.",
        buttonText: "Daftar Layanan"
    }, [
        {
            listTitle: 'Website Desa',
            value: '!~website_desa'
        },
        {
            listTitle: 'Website Berita',
            value: '!~website_berita'
        },
        {
            listTitle: 'Website Pendidikan',
            value: '!~website_pendidikan'
        }
    ])
}, {
    prefix: false
})

command.on(['website_desa'], ['command'], (mess) => {
    return client.sendButton(mess, {
        text: "Oy"
    }, [
        {
            reply: "halo",
            value: "!~test"
        }
    ])
})