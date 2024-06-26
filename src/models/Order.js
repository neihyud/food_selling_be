const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    address: {
      type: String
    },
    order_status: {
      type: String,
      required: true
    },
    sub_total: {
      type: Number,
      default: 0
    },
    payment_method: {
      type: String,
      default: 'cash'
    },
    payment_status: {
      type: String
    },
    transaction_id: {
      type: String
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

module.exports = mongoose.model('Order', OrderSchema)
