const socket = io()

socket.on("countUpdated", (count) => {
    console.log(`The count has been updated: ${count}`)
})

socket.on("message", (msg) => {
    console.log(msg)
    let elem = document.querySelector("#message")
    elem.innerHTML = elem.innerHTML + `<p> ${msg}</p>`
})

let elem = document.querySelector("#msg_form")

elem.addEventListener("submit", (e) => {
    e.preventDefault()
    // const msg = document.querySelector("input").value
    const msg = e.target.elements.message.value
    //console.log(msg)
    socket.emit("message", msg)
})