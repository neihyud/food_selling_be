const Chat = require('../models/Chat')
const User = require('../models/User')

/* eslint-disable camelcase */
exports.sendMessage = async (req, res) => {
  const userId = req.userId

  const { receiver_id, message } = req.body

  let receiverId = receiver_id
  if (!receiverId) {
    const admin = await User.findOne({ role: 'admin' })
    receiverId = admin.id
  }

  try {
    const chat = new Chat({
      sender_id: userId,
      receiver_id: receiverId,
      message
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
    $or: [{ receiver_id: admin.id, sender_id: userId }, { receiver_id: userId, sender_id: admin.id }]
  }).sort({ createdAt: 1 })

  return res.status(200).send({ success: true, data: listChat })
}

exports.getListUser = async (req, res) => {
  const admin = await User.findOne({ role: 'admin' })

  const listUser = await Chat.find({
    sender_id: {
      $ne: admin.id
    }
  }).distinct('sender_id')

  const sendersWithUsername = await User.find({
    _id: { $in: listUser }
  }).select('username')

  return res.status(200).send({ success: true, data: sendersWithUsername })
}
