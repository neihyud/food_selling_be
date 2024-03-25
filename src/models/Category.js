const mongoose = require('mongoose')

const { Schema } = mongoose

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String
    },
    status: {
      type: Boolean,
      default: 1
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

module.exports = mongoose.model('Category', CategorySchema)
