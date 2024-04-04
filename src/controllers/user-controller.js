/* eslint-disable camelcase */
const Address = require('../models/Address')

exports.getListAddressUser = async (req, res) => {
  const { id } = req.params

  const listAddress = await Address.find({ user_id: id })

  return res.status(200).send({ success: true, listAddress })
}

exports.createAddress = async (req, res) => {
  const userId = req.userId
  const {
    address,
    area,
    first_name,
    last_name,
    phone
  } = req.body

  const newAddress = new Address({
    user_id: userId,
    address,
    area,
    first_name,
    last_name,
    phone
  })

  await newAddress.save()

  return res.status(200).send({ success: true, address: newAddress })
}

exports.updateAddress = async (req, res) => {
  const userId = req.userId

  const { dataUpdate } = req.body

  const data = await Address.findOneAndUpdate({ user_id: userId }, { dataUpdate })
  return res.status(200).send({ success: true, address: data })
}

exports.getAddress = async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  const data = await Address.findOne({ user_id: userId, _id: id })
  return res.status(200).send({ success: true, address: data })
}
