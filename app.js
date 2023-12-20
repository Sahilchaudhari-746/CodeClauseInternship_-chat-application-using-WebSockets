const { Socket } = require('engine.io')
const express= require('express')
const path=require('path')
const app=express()
const PORT=process.env.PORT || 4000
const server=app.listen(PORT, ()=> console.log(`server on port ${PORT}`))

const io=require('socket.io')(server)
app.use(express.static(path.join(__dirname,'public')))
let socketconnected =new Set()
io.on('connection',onconnected)
function onconnected(socket)
{
console.log(socket.id)
socketconnected.add(socket.id)

io.emit('clients-total',socketconnected.size)
socket.on('disconnect',()=>{
console.log('Socket disconnected',socket.id)
socketconnected.delete(socket.id)

io.emit('clients-total',socketconnected.size)
})
socket.on('message',(data)=>{
    console.log(data)
    socket.broadcast.emit('chat-message',data)
})
socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
})
}   