const fs = require('fs/promises')
const path = require('path');

(async () => {
    const commandFilePath = path.join(__dirname, 'command.txt')
    const commandFile = 'command.txt'

    const watcher = await fs.watch(__dirname)
    let debouncer;

    for await (const event of watcher) {


        if (event.filename === commandFile && event.eventType === 'change') {
            if (debouncer) clearTimeout(debouncer)
            debouncer = setTimeout(async () => {

                console.log(event)
            }, 20)

        }
    }
})()


