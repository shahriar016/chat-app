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

io.on('connection', () => {
    console.log("New Web socket")
})

const port = process.env.port || 8082
server.listen(port, () => {
    console.log("chat-app started and listening at port: "+port)
})