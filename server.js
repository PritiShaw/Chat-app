const io = require('socket.io')(process.env.PORT || 5000)
io.origins('*:*')
io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text,time }) => {
    recipients.forEach(recipient => {
      console.log(time, id , text)
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text, time
      })
    })
  })
})
