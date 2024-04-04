const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    address_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Address'
    },
    order_status: {
      type: String,
      required: true
    },
    transaction_id: {
      type: String
    },
    subTotal: {
      type: Number,
      default: 0
    },
    payment_method: {
      type: String,
      default: 'cash'
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

module.exports = mongoose.model('Order', OrderSchema)
