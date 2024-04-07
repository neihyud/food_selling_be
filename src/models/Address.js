const mongoose = require('mongoose')

const { Schema } = mongoose

const AddressSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
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

module.exports = mongoose.model('Address', AddressSchema)
