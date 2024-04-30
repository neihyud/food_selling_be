/* eslint-disable camelcase */
const Slider = require('../models/Slider')
const GoogleDriveService = require('../services/google-drive-service')

exports.getListSlider = async (req, res) => {
  const slider = await Slider.find({})
  return res.status(200).json(slider)
}

exports.createSlider = async (req, res) => {
  // const { offer, title, sub_title, short_description } = req.body

  const path = req?.file?.path || ''
  const body = { ...req.body }
  if (path) {
    const originalNameImg = req?.file?.originalname?.split('.')[0] || new Date().toTimeString()
    const mineType = req.file.mimetype || ''

    const pathToImg = await GoogleDriveService.uploadFile({ originalNameImg, path, mineType })
    body.img = pathToImg
  }

  const newSlider = await Slider({ ...body })

  await newSlider.save()
  return res.status(200).json({ success: true })
}

exports.updateSlider = async (req, res) => {
  const { offer, title, sub_title, short_description } = req.body
  const path = req?.file?.path()
  const { id } = req.params

  const body = {}
  if (offer) {
    body.offer = offer
  }

  if (title) {
    body.title = title
  }

  if (sub_title) {
    body.sub_title = sub_title
  }
  if (short_description) {
    body.short_description = short_description
  }

  if ((path)) {
    const originalNameImg = req?.file?.originalname?.split('.')[0] || new Date().toTimeString()
    const mineType = req.file.mimetype || ''

    const pathToImg = await GoogleDriveService.uploadFile({ originalNameImg, path, mineType })
    body.img = pathToImg
  }

  await Slider.findOneAndUpdate({ _id: id }, body)
  return res.status(200).json({ success: true })
}

exports.getSlider = async (req, res) => {
  const { id } = req.params

  const slider = await Slider.findOne({ _id: id })

  return res.status(200).json(slider)
}

exports.deleteSlider = async (req, res) => {
  const { id } = req.params

  await Slider.findOneAndDelete({ _id: id })

  return res.status(200).json({ success: true })
}
