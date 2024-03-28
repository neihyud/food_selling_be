const { BadRequestError } = require('../errors/bad-request-error')
const User = require('../models/User')
const AuthService = require('../services/auth-service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
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

exports.updateUser = async (req, res) => {
  const { user_id } = req.body
  return res.status(200).send()
}
