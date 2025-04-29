const fs = require('fs/promises');
const path = require('path');

(async () => {
    const commandFile = 'command.txt'
    const directory = __dirname

    // file commands 
    const CREATE_FILE = "create the file"
    const DELETE_FILE = 'delete the file'
    const RENAME_FILE = 'rename the file'
    const ADD_TO_FILE = 'add to file'

    const createFile = async (filePath) => {

        filePath = path.join(__dirname, filePath.trim())
        try {
            //check if file exist 
            const existingFileHandler = await fs.open(filePath, "r");
            existingFileHandler.close()
            return console.log(`the file ${filePath} already exist`)
        } catch (e) {
            const newFileHandler = await fs.open(filePath, "w")
            console.log("a new file was successfully created")
            newFileHandler.close()
        }
    }

    const deleteFile = async (filePath) => {
        console.log('deleting file.....')
        filePath = path.join(__dirname, filePath.trim())
        try {
            const existingFile = await fs.open(filePath, "r")
            existingFile.close()
            await fs.unlink(filePath)

            console.log(`${filePath} has been deleted`)
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log('no file at this path to remove')
            } else {
                console.log('an error has occurred while removing the file')
                console.log(e)
            }
        }


    }

    const renameFile = async (oldPath, newPath) => {
        console.log('rename file')
        oldPath = path.join(__dirname, oldPath.trim())
        newPath = path.join(__dirname, newPath.trim())
        try {
            await fs.rename(oldPath, newPath)
            console.log('file was renamed')
        } catch (e) {
            if (e.code === "ENOENT") {
                consol.log('no file at this path to rename')
            } else {
                console.log('an error occurred while removing the file')
                console.log(e)
            }
        }
    }

    const addToFile = async (filePath, content) => {
        console.log('add to file')
        filePath = path.join(__dirname, filePath.trim())

        try {
            const fileHandle = await fs.open(filePath, "a")
            fileHandle.write(content)
            console.log('file has been edited')
        } catch (e) {
            if (e.code === "ENOENT") {
                consol.log('no file at this path to rename')
            } else {
                console.log('an error occurred while removing the file')
                console.log(e)
            }
        }
    }

    const handleCommand = (command) => {

        //create a file
        //create a file watcher
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1)
            createFile(filePath)
        }

        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1)
            deleteFile(filePath)
        }

        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(" to ");
            const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx)
            const newFilePath = command.substring(_idx + 4)

            renameFile(oldFilePath, newFilePath)
        }

        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(" this content: ")
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx)
            const content = command.substring(_idx + 15)

            addToFile(filePath, content)
        }
    }

    const handleFileChange = async () => {
        const commandFileHandler = await fs.open(`${__dirname}/command.txt`, 'r')

        try {
            console.log('file was changed')

            //read file content 
            //get size of file
            const size = (await commandFileHandler.stat()).size
            const buff = Buffer.alloc(size)
            const offset = 0
            const length = buff.byteLength
            const position = 0

            await commandFileHandler.read(buff, offset, length, position)
            const command = buff.toString('utf8')

            handleCommand(command)
        } catch (e) {
            console.log(e)
        } finally {
            commandFileHandler.close()
        }
    }



    const watcher = fs.watch(directory)
    let debounceTimer;
    for await (const event of watcher) {
        //check if file is changed
        if (event.filename === commandFile && event.eventType === 'change') {
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(async () => {

                handleFileChange()
            }, 200)

        }
    }

})()


