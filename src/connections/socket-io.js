const express = require('express')
const jwt = require('jsonwebtoken')

const { createServer } = require('http')
const { Server } = require('socket.io')
const configs = require('../config')
const User = require('../models/User')
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', (socket) => {
  socket.on('message', async data => {
    console.log('data ============ ', data)

    if (!data.token) {
      return
    }

    const decoded = jwt.verify(data.token, configs.tokenSecret)

    const admin = await User.find({ role: 'admin' })

    io.emit('messageResponse', {
      message: data.message,
      sender_id: data.receiver_id ? admin.id : decoded?.userId,
      receiver_id: data.receiver_id ? data.receiver_id : admin.id,
      ...data
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    // delete userSocketMap[userId]
    // io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

httpServer.listen(3001, () => { console.log('Socket running ...') })
