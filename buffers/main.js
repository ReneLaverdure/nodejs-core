const { Buffer } = require("buffer")

const memoryContainer = Buffer.alloc(4)

memoryContainer[3]

console.log(memoryContainer)
console.log(memoryContainer[0])

memoryContainer[0] = 0xf4
memoryContainer[1] = 0x34
memoryContainer[2] = 0x00
memoryContainer[3] = 0xff


console.log(memoryContainer[0])
console.log(memoryContainer)

console.log(memoryContainer.toString("hex"))
