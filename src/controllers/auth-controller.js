const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const config = require('../config/index')
const AuthService = require('../services/auth-service')
const { BadRequestError } = require('../errors/bad-request-error')

exports.login = async (req, res, next) => {
  const { username = '', password = '' } = req.body

  if (!username || !password) {
    throw new BadRequestError('Invalid username and/or password')
  }

  const user = await User.findOne({ username, status: 1, role: 'user' })
  if (!user) {
    throw new BadRequestError('Username not found')
  }

  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    throw new BadRequestError('Invalid password')
  }

  const payload = { userId: user._id }

  if (user.role === 'admin') {
    payload.role = 'admin'
  }

  try {
    const accessToken = jwt.sign(
      payload,
      config.tokenSecret
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error

    })
  }
}

function randomText () {
  const length = Math.floor(Math.random() * 10) + 1

  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

exports.register = async (req, res) => {
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

    const newUser = new User({ username, password: hashedPassword, role, name: randomText() })
    await newUser.save()

    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET
    )

    res.status(201).json({
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
