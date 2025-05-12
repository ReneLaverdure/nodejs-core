const fs = require('fs/promises');
const path = require('path');

(async () => {
    const commandFilePath = path.join(__dirname, 'command.txt')

    const checkPath = async (folderPath) => {
        try {
            await fs.access(folderPath, fs.constants.R_OK | fs.constants.W_OK)
            return true
        } catch (e) {
            return false

        }
    }

    const commandFileInput = async () => {
        console.log('a change has occurred')
        try {
            const commandFileHandler = await fs.open(commandFilePath, 'r')
            const size = (await commandFileHandler.stat()).size
            const buff = Buffer.alloc(size)
            const length = buff.byteLength
            const position = 0
            const offset = 0

            await commandFileHandler.read(buff, offset, length, position)
            const content = buff.toString('utf8')

            const folderPath = `${__dirname}/logs`
            console.log(folderPath)
            const doesPathExist = await checkPath(folderPath)

            console.log(doesPathExist)
            if (!doesPathExist) {
                fs.mkdir(folderPath)
            }
            await fs.appendFile(`${__dirname}/logs/logs.txt`, content)
            if (content.includes('ERROR')) {
                console.log('error has been detected')
                await fs.appendFile(`${__dirname}/logs/errors.txt`, content)
            }
            if (content.includes('WARNING')) {
                console.log('warning has been detected')
                await fs.appendFile(`${__dirname}/logs/warning.txt`, content)
            }

            console.log(content)
        } catch (e) {
            console.log(e)

        }
    }
    let debouncer;
    const watcher = fs.watch(__dirname);
    for await (const event of watcher) {
        if (event.eventType === 'change' && event.filename === 'command.txt') {
            if (debouncer) {
                clearTimeout(debouncer)
            }
            debouncer = setTimeout(async () => {
                commandFileInput()
            }, 20)
        }

    }
})()


