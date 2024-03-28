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

const handleGetIdImg = (pathGDrive) => {
  const idIndex = pathGDrive.indexOf('id=')
  if (idIndex !== -1) {
    const ampersandIndex = pathGDrive.indexOf('&', idIndex)

    return pathGDrive.substring(idIndex + 3, ampersandIndex !== -1 ? ampersandIndex : undefined)
  }

  return pathGDrive.replace('file/d', 'thumbnail?id=')
}

const GoogleDriveService = {
  uploadFile: async ({ originalNameImg: name, path: pathFile, type = 'image/jpg' }) => {
    try {
      const createFile = await drive.files.create({
        requestBody: {
          name,
          mimeType: type,
          parents: ['1vfK-fIFZZpq_Lo3n0hVvdDtYJ-MoYPxM']
        },
        media: {
          mimeType: type,
          body: fs.createReadStream(path.join(process.cwd(), `/${pathFile}`))
        }
      })

      const fileId = createFile.data.id
      console.log(createFile.data)

      const getUrl = await setFilePublic(fileId)

      console.log(getUrl.data)

      // return getUrl?.data?.webContentLink

      const idImg = handleGetIdImg(getUrl?.data?.webContentLink)

      return `https://drive.google.com/thumbnail?id=${idImg}`
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
