const socket = io()
socket.on('clients-total', (data) => {
    console.log(data)
})

const clientstotal = document.getElementById('clients-total');
const messagecontainer = document.getElementById('message-container')
const nameinput = document.getElementById('name-input');
const messageform = document.getElementById('message-form');
const messageinput = document.getElementById('message-input');

const messagetone= new Audio('/Message Tone.mp3')

messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})
socket.on('clients-total', (data) => {
    clientstotal.innerHTML = `Total Clients:${data}`
})
function sendMessage() {
    if (messageinput.value === '') return
    // console.log(messageinput.value)
    const data = {
        name: nameinput.value,
        message: messageinput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data)
    addmessagetout(true, data)
    messageinput.value = ''
}

socket.on('chat-message', (data) => {
    // console.log(data)
    messagetone.play()
    addmessagetout(false, data)
})
function addmessagetout(isownmessage, data) {
    clearfeedback()
    const element = `
<li class="${isownmessage ? "message-right" : "message-left"} ">
<p class="message">
    ${data.message}
    <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
</p>
</li>
`

    messagecontainer.innerHTML += element
    scrolltobottom()
}

function scrolltobottom() {
    messagecontainer.scrollTo(0, messagecontainer.scrollHeight)
}

messageinput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameinput.value} is typing a message✍️`
    })
})
// messageinput.addEventListener('keypress',(e)=>{
//     socket.emit('feedback',{
//         feedback:`${nameinput.value} is typing a message ✍️`
//     })
// })
// messageinput.addEventListener('blur',(e)=>{
//     socket.emit('feedback',{
//         feedback:''
//     })
// })


socket.on('feedback', (data) => {
    clearfeedback()
    const element = `
    <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
</li>`
messagecontainer.innerHTML += element
})
function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}