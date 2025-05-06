const fs = require('fs/promises')
const path = require('path');

const readEntry = (record, entry) => {
    const result = {}
    for (key in record) {
        result[key] = record[key][entry]
    }
    console.log(result)
}

const readCVS = (data) => {
    const result = {}
    data = data.split('\r\n')
    data[0] = data[0].split(',')
    for (let i = 0; i < data[0].length; i++) {
        result[data[0][i]] = []
    }

    data.pop()

    for (let i = 1; i < data.length; i++) {
        let entry = data[i].split(',')
        entry.forEach((ele, index) => {
            switch (index) {
                case 0: {
                    result.name.push(ele)
                    break;
                }
                case 1: {
                    result.lastname.push(ele)
                    break;
                }
                case 2: {
                    result.address.push(ele)
                    break;
                }
                case 3: {
                    result.birth.push(ele)
                    break;
                }
                case 4: {
                    result.gender.push(ele)
                    break;
                }

                default:
                    break;
            }
        });
    }
    console.log(result)
    readEntry(result, 2)

}



(async () => {
    const commandFilePath = path.join(__dirname, 'command.txt')
    const commandFile = 'command.txt'

    //input commands 
    const READ_FILE = 'read file'
    const SPLIT_FILE = 'split file'
    const MERGE_FILE = 'merge'


    const openFile = async (path) => {
        const fileHandler = await fs.open(path)

        try {
            console.log('reading file')

            const size = (await fileHandler.stat()).size
            const buff = Buffer.alloc(size)
            const offset = 0
            const length = buff.byteLength
            const position = 0

            await fileHandler.read(buff, offset, length, position)
            const command = buff.toString('utf8')

            return command
        } catch (error) {
            console.log(e)
        } finally {
            fileHandler.close()
        }
    }

    const readCommandFile = async (filePath) => {
        const file = await openFile(filePath)

        if (file.includes(READ_FILE)) {
            const filePath = file.substring(READ_FILE.length + 1)
            parseFile(filePath)
        }
        if (file.includes(SPLIT_FILE)) {
            const filePath = file.substring(SPLIT_FILE.length + 1)
            splitFile(filePath)
        }
        if (file.includes(MERGE_FILE)) {
            const filePath = file.substring(MERGE_FILE.length + 1)
            const fileName = path.parse(filePath).name
            const dirPath = path.join(__dirname, fileName)

            mergeFile(dirPath, 'newData.csv')
        }
    }

    const parseFile = async (filePath) => {
        filePath = path.join(__dirname, filePath).trim()
        const file = await openFile(filePath)
        readCVS(file)
    }
    //console.log(data[0][i])

    const splitFile = async (filePath, div = 3) => {
        console.log('spliting file...')
        filePath = path.join(__dirname, filePath).trim()
        const fileName = path.parse(filePath).name
        const dirPath = `${__dirname}/${fileName}`
        fs.mkdir(dirPath)

        const fileHandler = await fs.open(filePath)
        try {
            const size = (await fileHandler.stat()).size
            const split = Math.ceil(size / div)
            const fullBuff = Buffer.alloc(split)
            const length = fullBuff.byteLength
            let offset = 0
            let position = 0

            for (let i = 0; i < div; i++) {
                position = split * i
                await fileHandler.read(fullBuff, offset, length, position)
                const dataFile = fullBuff.toString('utf8')
                fs.writeFile(`${dirPath}/${path.parse(filePath).name}-${i}.csv`, dataFile)
            }

        } catch (e) {
            console.log(e)
        } finally {
            fileHandler.close()
        }
    }

    const mergeFile = async (dirPath, newFileName) => {

        try {
            const dir = await fs.readdir(dirPath)


            for (const dirent of dir) {
                const filePath = path.join(dirPath, dirent)

                const fileHandler = await fs.open(filePath)
                const size = (await fileHandler.stat()).size
                const buff = Buffer.alloc(size)
                const length = buff.byteLength

                await fileHandler.read(buff, 0, length, 0)
                const content = buff.toString('utf8')
                await fs.appendFile(`${dirPath}/${newFileName}`, content)
            }

        } catch (e) {
            console.log(e)

        }
    }

    const watcher = fs.watch(__dirname)
    let debouncer;

    for await (const event of watcher) {

        if (event.filename === commandFile && event.eventType === 'change') {
            if (debouncer) clearTimeout(debouncer)
            debouncer = setTimeout(async () => {
                console.log(event)
                readCommandFile(commandFilePath)

            }, 20)

        }
    }
})()


