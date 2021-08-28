const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io") // socketio is a function
const {generateMessage, generateLocationMessage} = require("./utils/messages")
const { isObject, callbackify } = require("util")
const {addUser, getUser, removeUser, getUserInRoom} = require("./utils/users")
// console.log("Hello World There")
const app = express()
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

const server = http.createServer(app)
const io = socketio(server)
let count = 0

io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {
        //console.log(username, room)
        const {error, user} = addUser({id:socket.id, ...options})
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", generateMessage("Welcome to the Chap-App", "Admin"))
        socket.broadcast.to(user.room).emit("message", generateMessage("A New User is Connected", "Admin"))
    })
    socket.on("message", (msg,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("message", generateMessage(msg, user.username))
        callback()
    })
    socket.on('locationMessage', (url, callback) => {
        //console.log(coords)
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(url, user.username))
        callback()
    })
    socket.on("disconnect", () => {
        const user = getUser(socket.id)
        if(user) {
            removeUser(user.id)
            io.to(user.room).emit("message", generateMessage("A User Has Left", "Admin"))
        }
    })

})

const port = process.env.port || 8082
server.listen(port, () => {
    console.log("chat-app started and listening at port: "+port)
})