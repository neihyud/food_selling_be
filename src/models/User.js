const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: 1
    },
    name: {
      type: String
    }
  },
  {
    toJSON: {
      timestamps: true,
      transform (doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

module.exports = mongoose.model('User', UserSchema)
