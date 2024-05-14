const mongoose = require('mongoose')

const { Schema } = mongoose

const ReviewSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    review: {
      type: String
    },
    rating: {
      type: Number
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

module.exports = mongoose.model('Review', ReviewSchema)
