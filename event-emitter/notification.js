const eventEmitters = require("events")
const { program } = require("commander")


class Emitter extends eventEmitters {

}

const emitter = new Emitter()
const rooms = {}

emitter.on("email", () => {
    console.log("new email")
})

emitter.on("email", () => {
    console.log("second email trigger")
})

emitter.emit("email")



