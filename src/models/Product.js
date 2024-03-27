const mongoose = require('mongoose')

const { Schema } = mongoose

const ProductSchema = new Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String
    },
    thumb_img: {
      type: String
    },
    price: {
      type: Number,
      default: 0
    },
    offer_price: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      default: 0
    },
    sku: {
      type: String,
      default: 0
    },
    status: {
      type: Number,
      default: 0
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

module.exports = mongoose.model('Product', ProductSchema)
