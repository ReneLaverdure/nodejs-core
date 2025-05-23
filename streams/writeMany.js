const fs = require('fs/promises');
const streams = require('stream/promises');


// async function main() {
//     console.time('writeMany')
//     const fileHandler = await fs.open('data.txt', 'w')
//     const stream = fileHandler.createWriteStream()
//
//
//     for (let i = 0; i <= 1000000; i++) {
//         const buff = Buffer.from(` ${i} `, 'utf-8')
//         stream.write(buff)
//     }
//
//
//     console.timeEnd('writeMany')
//
//
// }
// main()
(async () => {
    console.time('writeMany')
    const fileHandler = await fs.open('data.txt', 'w')
    const stream = fileHandler.createWriteStream()
    let i = 0
    const numberOfWrites = 1000000
    const writeMany = () => {
        while (i <= numberOfWrites) {
            const buff = Buffer.from(` ${i} `, 'utf-8')
            if (i === numberOfWrites) {
                return stream.end(buff)

            }
            if (!stream.write(buff)) break;
            i++
        }


    }
    writeMany()
    //resume loop once stream internal buffer is empty
    stream.on('drain', () => {
        console.log('draining')
        writeMany()
    })

    stream.on('finish', () => {

        console.timeEnd('writeMany')
        fileHandler.close()
    })


})()

