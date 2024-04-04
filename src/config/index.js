const dotenv = require('dotenv')

dotenv.config()

const configs = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/food',
  tokenSecret: process.env.ACCESS_TOKEN_SECRET || 'SecretToken',
  port: process.env.PORT || 8080,
  clientIdGDrive: process.env.CLIENT_ID,
  clientSecretGDrive: process.env.CLIENT_SECRET,
  refreshTokenGDrive: process.env.REFRESH_TOKEN_GD,
  stripePrivateKey: process.env.STRIPE_PRIVATE_KEY,

  roles: {
    admin: 'admin',
    user: 'user',
    staff: ' staff'
  }
}

module.exports = configs
