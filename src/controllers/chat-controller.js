const Chat = require('../models/Chat')
const User = require('../models/User')

/* eslint-disable camelcase */
exports.sendMessage = async (req, res) => {
  const userId = req.userId

  const { receiver_id, message } = req.body

  let receiverId = receiver_id
  let isStore = true
  if (!receiverId) {
    const admin = await User.findOne({ role: 'admin' })
    receiverId = admin.id
    isStore = false
  }

  try {
    const chat = new Chat({
      sender_id: userId,
      receiver_id: receiverId,
      message,
      isStore
    })
    await chat.save()
  } catch (err) {
    console.log('Error == ', err)
  }

  return res.status(200).json({ success: true })
}

exports.getChat = async (req, res) => {
  let userId = req.userId
  const admin = await User.findOne({ role: 'admin' })

  // to do admin send

  const { receiverId } = req.query

  if (receiverId) {
    userId = receiverId
  }

  const listChat = await Chat.find({
    $or: [{ sender_id: userId }, { receiver_id: userId }]
  }).sort({ createdAt: 1 })

  return res.status(200).send({ success: true, data: listChat })
}

exports.getListUser = async (req, res) => {
  const admin = await User.findOne({ role: 'admin' })

  const listUser = await Chat.find({
    isStore: false,
    sender_id: {
      $ne: admin.id
    }
  }).distinct('sender_id')

  const sendersWithUsername = await User.find({
    _id: { $in: listUser }
  }).select('username img')

  return res.status(200).send({ success: true, data: sendersWithUsername })
}
