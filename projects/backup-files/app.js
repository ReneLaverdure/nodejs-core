const fs = require('fs/promises');
const path = require('path');

async function checkPath(dirPath) {
    try {
        await fs.access(dirPath, fs.constants.R_OK | fs.constants.W_OK)
        return true
    } catch (e) {
        return false

    }
}

async function main() {
    console.log('MAIN FUNCTION')

    const dataFilePath = path.join(__dirname, 'data')
    const doPathExist = await checkPath(path.join(__dirname, 'backup-dump'))
    const backupPath = path.join(__dirname, 'backup-dump')

    if (!doPathExist) {
        fs.mkdir(backupPath)
    }

    const dir = await fs.opendir(dataFilePath)
    for await (const dirent of dir) {

        try {
            const filePath = path.join(dirent.parentPath, dirent.name)
            const fileHandler = await fs.open(filePath)

            const size = (await fileHandler.stat()).size
            const buff = Buffer.alloc(size)
            const length = buff.byteLength
            const position = 0
            const offset = 0

            await fileHandler.read(buff, offset, length, position)
            const content = buff.toString('utf8')
            fs.writeFile(`${backupPath}/${dirent.name}`, content)
        } catch (e) {

            console.log(e)
        }



    }

}

main()

// setInterval(async () => {
//     main()
// }, 1000)
//



