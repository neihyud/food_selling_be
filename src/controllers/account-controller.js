/* eslint-disable camelcase */
const configs = require('../config')
const { BadRequestError } = require('../errors/bad-request-error')
const User = require('../models/User')
const AuthService = require('../services/auth-service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createStaff = async (req, res) => {
  // to do verify admin role
  const { username, password } = req.body

  const errors = AuthService.validateInputAuth({ username, password })

  if (Object.keys(errors).length) {
    throw new BadRequestError('Invalid username and/or password')
  }

  const salt = 10

  try {
    const user = await User.findOne({ username })

    if (user) {
      return res
        .status(400)
        .json({ success: false, errors: { username: 'Username already taken' } })
    }

    const role = 'user'

    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ username, password: hashedPassword, role })
    await newUser.save()

    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      configs.tokenSecret
    )

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      accessToken,
      user: {
        username
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

exports.getListStaff = async (req, res) => {
  try {
    const listStaff = await User.find({ role: 'user' }).select('username status')
    return res.status(200).send(listStaff)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

exports.getStaff = async (req, res) => {
  const { id } = req.params

  const staff = await User.findOne({ _id: id }).select('-password')

  res.status(200).send({ success: true, data: staff })
}

exports.updateStaff = async (req, res) => {
  const { id } = req.params

  const {
    username,
    status = 1
  } = req.body

  const user = await User.findOneAndUpdate({ _id: id }, { username, status }, {
    new: true
  })

  if (!user) {
    throw new BadRequestError('Not found staff to update')
  }

  return res.status(200).send({ success: true, data: { username, status } })
}

exports.deleteStaff = async (req, res) => {
  const { id } = req.params

  const staff = await User.findOneAndDelete({ _id: id })
  if (!staff) {
    throw new BadRequestError('Not found delete to update')
  }

  return res.status(200).send({ success: true, data: { id, name: staff.name } })
}
