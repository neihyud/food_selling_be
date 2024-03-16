const dotenv = require('dotenv')

dotenv.config()

const configs = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/food',
  tokenSecret: process.env.ACCESS_TOKEN_SECRET || 'SecretToken',
  port: process.env.PORT || 8080
}

module.exports = configs
