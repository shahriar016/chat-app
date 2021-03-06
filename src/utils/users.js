const users = []

const addUser = ({id, username, room}) => {
    //console.log(username, room)
    if(!username || !room) {
        return {"error": "username and room must be provided"}
    }
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    const tmp = users.find((user) => (user.username===username || user.id===id) && user.room==room)
    if(tmp) {
        return {"error": "username and id must be unique for this room"}
    }
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id===id)
    //console.log(index)
    if(index!=-1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find((user) => user.id===id)

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room == room)
}

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}
