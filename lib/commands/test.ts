command.on(['hey'], ['test'], (mess) => {
    return client.sendButton(mess, {
        text: "This is a list",
        footer: "nice footer, link: https://google.com",
        buttonText: "klik saya"
    }, [
        {
            listTitle: 'ffwf',
            value: '!~test'
        },
        {
            title: 'halo ini title',
            listTitle: 'pilih ini',
            value: '!~test'
        },
        {
            listTitle: 'eeffwf',
            value: '!~test'
        }
    ])
}, {
    prefix: false
})

command.on(['test'], ['test'], (mess) => {
    return client.sendButton(mess, {
        text: "Oy"
    }, [
        {
            reply: "halo",
            value: "!~test"
        }
    ])
})