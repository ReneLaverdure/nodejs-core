const { pipeline } = require('node:stream')
const fs = require('fs/promises');

// (async () => {
//     console.time('copying')
//     const fileHandler = await fs.open('data.txt', 'r')
//     const newFile = await fs.open('newData.txt', 'w')
//
//     let bytesRead = -1
//     while (bytesRead !== 0) {
//         const readResult = await fileHandler.read()
//         bytesRead = readResult.bytesRead
//
//         if (bytesRead !== 16384) {
//             const indexOfNotFill = readResult.buffer.indexOf(0)
//             const newBuffer = Buffer.alloc(indexOfNotFill)
//             readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFill,)
//             newFile.write(newBuffer)
//         } else {
//             newFile.write(readResult.buffer)
//         }
//
//     }
//
//     console.timeEnd('copying')
//
// })()

(async () => {
    console.time('copying')
    const fileHandler = await fs.open('data.txt', 'r')
    const newFile = await fs.open('newData.txt', 'w')

    const readStream = fileHandler.createReadStream()
    const writeStream = newFile.createWriteStream()

    pipeline(readStream, writeStream, (err) => {
        console.log(err)
        console.timeEnd('copying')
    })



})()
