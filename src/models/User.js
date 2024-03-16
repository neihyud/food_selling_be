const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform (doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

module.exports = mongoose.model('User', UserSchema)
