const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderItemSchema = new Schema(
  {
    order_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Order'
    },
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    },
    product_name: {
      type: String
    },
    qty: {
      type: Number
    },
    price: {
      type: Number,
      require: true
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

module.exports = mongoose.model('OrderItem', OrderItemSchema)
