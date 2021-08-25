const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io") // socketio is a function
const {generateMessage, generateLocationMessage} = require("./utils/messages")
const { isObject, callbackify } = require("util")

const app = express()
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

const server = http.createServer(app)
const io = socketio(server)
let count = 0

io.on('connection', (socket) => {
    socket.on('join', ({username, room}) => {
        console.log(username, room)
        socket.join(room)
        socket.emit("message", generateMessage("Welcome to the Chap-App"))
        socket.broadcast.to(room).emit("message", generateMessage("A New User is Connected"))
    })
    socket.on("message", (msg,callback) => {
        io.emit("message", generateMessage(msg))
        callback()
    })
    socket.on('locationMessage', (url, callback) => {
        //console.log(coords)
        io.emit('locationMessage',generateLocationMessage(url))
        callback()
    })
    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A User Has Left"))
    })

})

const port = process.env.port || 8082
server.listen(port, () => {
    console.log("chat-app started and listening at port: "+port)
})