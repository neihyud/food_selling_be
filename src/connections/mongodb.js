const mongoose = require('mongoose')
const config = require('../config/index')
const DatabaseConnectionError = require('../errors/database-connection-error.js')
const connect = async () => {
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('MongoDb connect success!')
  } catch (error) {
    console.log('MongoDb connect fail: ', error)
    throw new DatabaseConnectionError()
  }
}

module.exports = { connect }
