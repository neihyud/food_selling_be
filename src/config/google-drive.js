const { google } = require('googleapis')
const config = require('./index')

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const oauth2Client = new google.auth.OAuth2(
  config.clientIdGDrive,
  config.clientSecretGDrive,
  REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: config.refreshTokenGDrive })

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})

module.exports = drive
