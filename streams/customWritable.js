const { Writable } = require('node:stream')
const fs = require('node:fs')


class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark })
        this.fileName = fileName
        this.fd = null
        this.chunks = []
        this.chunksSize = 0
        this.writeCount = 0

    }

    // will run after constructor and will put off call other methods until 
    // the callback function is called 
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                callback(err)
            } else {
                this.fd = fd
                // no agrus means success 
                callback()
            }
        })
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length


        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err)
                }

                this.chunks = []
                this.chunksSize = 0
                ++this.writeCount
                callback()
            })
        } else {

            callback()
        }


    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err)
            ++this.writeCount
            this.chunks = []
            callback()
        })
    }
    _destroy(error, callback) {
        console.log('number of writes: ', this.writeCount)
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error)
            })
        } else {
            callback(error)
        }
    }
}

// const stream = new FileWriteStream({ highWaterMark: 1800, fileName: 'text.txt' })
// stream.write(Buffer.from('this is some string'))
// stream.end(Buffer.from('our last write'))
// stream.on('finish', () => {
//     console.log('stream is finish')
// })

(async () => {
    console.time('writeMany')

    const stream = new FileWriteStream({ fileName: 'text.txt' })
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

    })


})()

