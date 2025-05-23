const fs = require('fs/promises')
const path = require('path');

(async () => {
    console.log('chat room')
    const usersPath = path.join(__dirname, 'users')
    const chatRoomPath = path.join(__dirname, 'chat-room.txt')
    const watcher = fs.watch(usersPath)
    let debounce;

    const handleInput = async (file) => {
        console.log(file)
        let filePath = path.join(__dirname, 'users', file)
        let user = path.parse(file).name
        console.log(user)
        filePath = filePath.slice(0, -1)

        console.log(filePath)
        try {
            const fileHandler = await fs.open(filePath)

            const size = (await fileHandler.stat()).size
            const buff = Buffer.alloc(size)
            const length = buff.byteLength

            await fileHandler.read(buff, 0, length, 0)
            let content = buff.toString('utf8')
            const currentTime = new Date()
            const time = currentTime.toLocaleString()
            content = `At ${time} \n${user}: ${content}`
            fs.appendFile(chatRoomPath, content)
        } catch (e) {
            console.log(e)

        }
    }

    for await (const event of watcher) {
        if (debounce) clearTimeout(debounce)

        debounce = setTimeout(() => {
            console.log(event)
            handleInput(event.filename)
        }, 20)
    }
})()
