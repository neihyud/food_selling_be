const express = require('express')
const router = express.Router()

const chatController = require('../controllers/chat-controller')
router.post('/send-message', chatController.sendMessage)
router.get('/', chatController.getChat)

// admin
router.get('/get-list-user', chatController.getListUser)

module.exports = router
