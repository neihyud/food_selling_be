const jwt = require('jsonwebtoken')
const config = require('../config/index')
const User = require('../models/User')
const { NotAuthorizedError } = require('../errors/not-authorized-error')
const { BadRequestError } = require('../errors/bad-request-error')

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    throw new NotAuthorizedError()
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    throw new NotAuthorizedError()
  }

  try {
    const decoded = jwt.verify(token, config.accessTokenSecret)

    const user = await User.findOne({ _id: decoded.userId })

    if (!user) {
      throw new BadRequestError('User not found')
    }

    req.userId = decoded.userId
    req.user = user

    next()
  } catch (error) {
    throw new Error('Invalid token')
  }
}

module.exports = { verifyToken }
