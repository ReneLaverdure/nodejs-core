const { Buffer } = require("buffer")

const memoryBuffer = Buffer.alloc(3)

memoryBuffer[0] = 0x48
memoryBuffer[1] = 0x69
memoryBuffer[2] = 0x21

console.log(memoryBuffer)
console.log(memoryBuffer.toString("utf8"))

const buffer = Buffer.alloc(1e9)

setInterval(() => {

    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = 0x22
    }
}, 5000)

