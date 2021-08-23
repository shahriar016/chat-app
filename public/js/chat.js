const socket = io()

let msg_form = document.querySelector("#msg_form")
let msg_btn = document.querySelector("#msg_btn")
let msg_input = document.querySelector("input")
let msg_box = document.querySelector("#message")

socket.on("countUpdated", (count) => {
    console.log(`The count has been updated: ${count}`)
})

socket.on("message", (msg) => {
    console.log(msg)
    msg_box.innerHTML += `<p> ${msg}</p>`
})


msg_form.addEventListener("submit", (e) => {
    e.preventDefault()
    // const msg = document.querySelector("#msg_btn").value
    msg_btn.setAttribute("disabled","disabled")
    const msg = e.target.elements.message.value
    //console.log(msg)
    socket.emit("message", msg , (message) => {
        console.log("acknowledgement:", message)
        msg_btn.removeAttribute("disabled")
        msg_input.value = ''
    })
})
var getGeoLocation = function(e) {
    if(!navigator.geolocation) {
        return alert("GeoLocation is not supported by your browser")
    }
    e.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }
        console.log(coords)
        socket.emit('sendLocation', coords, (msg) => {
            const template = `<a href="https://www.google.com/maps?q=${coords.latitude},${coords.longitude}">My Current Location<a><br>`
            msg_box.innerHTML += template
            e.removeAttribute('disabled')
        })
    })
}