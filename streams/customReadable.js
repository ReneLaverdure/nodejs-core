const { Readable } = require('node:stream')
const fs = require('node:fs')

class FileReadStream extends Readable {
    constructor({ highWaterMark, filename }) {
        super({ highWaterMark });
        this.filename = filename
        this.fd = null
    }

    _construct(callback) {
        fs.open(this.filename, 'r', (err, fd) => {
            if (err) return callback(err)
            this.fd = fd
            callback()
        })
    }

    _read(size) {
        const buff = Buffer.alloc(size)
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err)
            // null indicates end of streams 
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null)
        })
    }

    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, (err) => callback(err || error))
        } else {
            callback(error)
        }
    }
}


const stream = new FileReadStream({ filename: 'data.txt' })

stream.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'))
})

stream.on('end', () => {
    console.log('stream is done reading')
})
