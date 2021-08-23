const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io") // socketio is a function
const { isObject, callbackify } = require("util")

const app = express()
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

const server = http.createServer(app)
const io = socketio(server)
let count = 0

io.on('connection', (socket) => {
    socket.emit("message", "Welcome to the Chap-App")
    socket.broadcast.emit("message", "A New User is Connected")
    socket.on("message", (msg,callback) => {
        io.emit("message", msg)
        callback("message received and processed successfully")
    })

    socket.on("increment",() => {
        // count++
        //socket.emit("countUpdated",count) //emit only to this socket
        //io.emit("countUpdated",count) // emit to all socket connected to server
    })
    socket.on('sendLocation', (coords, callback) => {
        console.log(coords)
        socket.broadcast.emit('message',`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback("success")
    })
    socket.on("disconnect", () => {
        io.emit("message", "A User Has Left")
    })

})

const port = process.env.port || 8082
server.listen(port, () => {
    console.log("chat-app started and listening at port: "+port)
})