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

socket.emit('join', {username, room}, (error) => {
    if(error) alert(error)
    location.href = '/'
})

const autoscroll = () => {
    const newMsg = msg_box.lastElementChild

    const msgStyles = getComputedStyle(newMsg)
    const msgMargin = parseInt(msgStyles.marginBottom)
    const msgHeight = newMsg.offsetHeight + msgMargin
    // visible height
    const visibleHeight = msg_box.offsetHeight
    // height of the message container
    const boxHeight = msg_box.scrollHeight 
    // how far have I scrolled?
    const scrollOffset = msg_box.scrollTop + visibleHeight
    //console.log(`boxHeight: ${boxHeight} crollOffset: ${scrollOffset} visibleHeight: ${visibleHeight}`)
    if(scrollOffset >= boxHeight -  msgHeight) {
        msg_box.scrollTop = msg_box.scrollHeight
    }
}

socket.on("message", (msg) => {
    // console.log(msg)
    // msg_box.innerHTML += `<p> ${msg}</p>`
    const html = Mustache.render(messageTemplate,{
        message: msg.text,
        username: msg.username,
        createdAt: moment(msg.createdAt).format("hh:mm a")
    })
    //console.log(html)
    msg_box.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on("locationMessage", (msg) => {
    //console.log(msg)
    // msg_box.innerHTML += `<p> ${msg}</p>`
    const message = Mustache.render(locationTemplate,{
        url: msg.url,
        username: msg.username,
        createdAt: moment(msg.createdAt).format("hh:mm a")
    })
    //console.log(html)
    msg_box.insertAdjacentHTML('beforeend', message)
    autoscroll()
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
        console.log("Hi There")
        console.log("acknowledgement:", message)
        msg_btn.removeAttribute("disabled")
        msg_input.value = ''
    })
})
