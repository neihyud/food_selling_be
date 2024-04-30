const mongoose = require('mongoose')

const { Schema } = mongoose

const SliderSchema = new Schema(
  {
    offer: {
      type: String
    },
    title: {
      type: String
    },
    sub_title: {
      type: String
    },
    short_description: {
      type: String
    },
    img: {
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

module.exports = mongoose.model('Slider', SliderSchema)
