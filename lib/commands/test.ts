command.on(['image'], ['command'], async (mess) => {
    return client.sendMessage(mess, { image: 'https://picsum.photos/536/354' })
})