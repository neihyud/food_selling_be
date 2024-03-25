const drive = require('../config/google-drive')
const fs = require('fs')
const path = require('path')

const setFilePublic = async (fileId) => {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })

    const getUrl = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink'
    })

    return getUrl
  } catch (error) {
    console.error(error)
  }
}

const GoogleDriveService = {
  uploadFile: async ({ name, type = 'image/jpg' }) => {
    try {
      const createFile = await drive.files.create({
        requestBody: {
          name,
          mimeType: type,
          parents: ['']
        },
        media: {
          mimeType: type,
          body: fs.createReadStream(path.join(__dirname, '/../cr7.jpg'))
        }
      })

      const fileId = createFile.data.id
      console.log(createFile.data)

      const getUrl = await setFilePublic(fileId)

      console.log(getUrl.data)
    } catch (error) {
      console.error(error)
    }
  },

  deleteFile: async (fileId) => {
    try {
      console.log('Delete File:::', fileId)
      const deleteFile = await drive.files.delete({
        fileId
      })

      console.log(deleteFile.data, deleteFile.status)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = GoogleDriveService
