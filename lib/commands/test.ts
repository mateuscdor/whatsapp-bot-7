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
            title: 'def',
            listTitle: 'eeffwf',
            value: '!~test'
        }
    ])
}, {
    prefix: false
})

command.on(['test'], ['test'], (mess) => {
    return client.reply(mess, 'hello world')
})