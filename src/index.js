const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io") // socketio is a function
const { isObject } = require("util")

const app = express()
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

const server = http.createServer(app)
const io = socketio(server)
let count = 0

io.on('connection', (socket) => {
    socket.emit("countUpdated", count)
    socket.on("increment",() => {
        count++
        socket.emit("countUpdated",count) //emit only to this socket
        //io.emit("countUpdated",count) // emit to all socket connected to server
    })
})

const port = process.env.port || 8082
server.listen(port, () => {
    console.log("chat-app started and listening at port: "+port)
})