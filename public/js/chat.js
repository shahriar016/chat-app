const socket = io()

let msg_form = document.querySelector("#message-form")
let msg_btn = document.querySelector("#msg_btn")
let msg_input = document.querySelector("input")
let msg_box = document.querySelector("#messages")

// html templates
let messageTemplate = document.querySelector("#message-template").innerHTML
let locationTemplate = document.querySelector("#location-template").innerHTML

// options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('join', {username, room})

socket.on("message", (msg) => {
    // console.log(msg)
    // msg_box.innerHTML += `<p> ${msg}</p>`
    const html = Mustache.render(messageTemplate,{
        message: msg.text,
        createdAt: moment(msg.createdAt).format("hh:mm a")
    })
    //console.log(html)
    msg_box.insertAdjacentHTML('beforeend', html)
})


socket.on("locationMessage", (msg) => {
    //console.log(msg)
    // msg_box.innerHTML += `<p> ${msg}</p>`
    const html = Mustache.render(locationTemplate,{
        url: msg.url,
        createdAt: moment(msg.createdAt).format("hh:mm a")
    })
    //console.log(html)
    msg_box.insertAdjacentHTML('beforeend', html)
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
        const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
        //console.log(url)
        socket.emit('locationMessage', url, (msg) => {
            if(msg) console.log(msg)
            e.removeAttribute('disabled')
        })
    })
}
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
