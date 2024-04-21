/* eslint-disable camelcase */
const { BadRequestError } = require('../errors/bad-request-error')
const Address = require('../models/Address')
const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.getListAddressUser = async (req, res) => {
  const userId = req.userId

  const listAddress = await Address.find({ user_id: userId })

  return res.status(200).send({ success: true, data: listAddress })
}

exports.createAddress = async (req, res) => {
  const userId = req.userId
  const {
    address,
    first_name,
    last_name,
    phone,
    email
  } = req.body

  const newAddress = new Address({
    user_id: userId,
    address,
    email,
    first_name,
    last_name,
    phone
  })

  await newAddress.save()

  return res.status(200).send({ success: true, address: newAddress })
}

exports.updateAddress = async (req, res) => {
  const userId = req.userId
  const { id } = req.body

  const data = await Address.findOneAndUpdate({ user_id: userId, _id: id }, { ...req.body })
  return res.status(200).send({ success: true, address: data })
}

exports.getAddress = async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  const data = await Address.findOne({ user_id: userId, _id: id })
  return res.status(200).send({ success: true, address: data })
}

exports.deleteAddress = async (req, res) => {
  const { id } = req.params
  const userId = req.userId
  await Address.findOneAndDelete({ user_id: userId, _id: id })

  return res.status(200).send({ success: true })
}

exports.getUser = async (req, res) => {
  return res.status(200).send({ success: true, data: req.user })
}

exports.updateUser = async (req, res) => {
  const userId = req.userId
  const { name, email } = req.body

  const updateData = {}
  if (name) {
    updateData.name = name
  }

  if (email) {
    updateData.email = email
  }

  await User.findOneAndUpdate({ _id: userId }, { ...updateData })

  return res.status(200).send({ success: true })
}

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.userId

  const user = await User.findOne({ _id: userId })
  if (!user) {
    throw new BadRequestError('User not found')
  }

  const passwordValid = await bcrypt.compare(oldPassword, user.password)

  if (!passwordValid) {
    throw new BadRequestError('Password invalid')
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await User.updateOne({ _id: userId }, { password: hashedPassword })

  return res.status(200).send({ success: true })
}
