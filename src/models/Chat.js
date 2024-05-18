const mongoose = require('mongoose')

const { Schema } = mongoose

const ChatSchema = new Schema(
  {
    sender_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    seen: {
      type: Boolean,
      default: false
    },
    isStore: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      timestamps: true,
      transform (doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

module.exports = mongoose.model('Chat', ChatSchema)
