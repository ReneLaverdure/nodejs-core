const EventEmitter = require("events")

class Emitter extends EventEmitter {

}

const myE = new Emitter()

myE.on("foo", () => {
    console.log("an event ocurred 1")
})

myE.on("foo", () => {
    console.log("an event ocurred 2")
})

myE.on("foo", (x) => {
    console.log("an event ocurred with a parameter occurred")
    console.log(x)
})

myE.on("bar", () => {
    console.log("an event occurred bar")
})



myE.emit("foo")
myE.emit("foo", "some text")
myE.emit("bar")
