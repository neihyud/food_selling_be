const { BadRequestError } = require('../errors/bad-request-error')
const Category = require('../models/Category')
const Product = require('../models/Product')
const GoogleDriveService = require('../services/google-drive-service')

const getProducts = async (req, res) => {
  const listProduct = await Product.find({})

  res.status(200).send(listProduct)
}

const getProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findOne({ _id: id })

  res.status(200).send(product)
}

const createProduct = async (req, res) => {
  const {
    name,
    description,
    status = 1,
    price,
    // eslint-disable-next-line camelcase
    category_id
  } = req.body

  console.log('req.body', req.body)

  const path = req?.file?.path || ''
  const originalNameImg = req?.file?.originalname?.split('.')[0] || new Date().toTimeString()
  const mineType = req.file.mimetype || ''

  const pathToImg = await GoogleDriveService.uploadFile({ originalNameImg, path, mineType })

  console.log('pathToImg ', pathToImg)
  try {
    const newProduct = new Product({
      name,
      description,
      status,
      thumb_img: pathToImg.toString(),
      price,
      // eslint-disable-next-line camelcase
      category_id
    })

    await newProduct.save()
    return res.status(201).send({ success: true, data: newProduct })
  } catch (error) {
    throw new Error(error)
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params

  const { name, description, status } = req.body

  const product = await Product.findOneAndUpdate({ _id: id }, { name, description, status }, {
    new: true
  })

  if (!product) {
    throw new BadRequestError('Not found product to update')
  }

  return res.status(200).send({ success: true, data: { name, description, status } })
}

const deleteProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findOneAndDelete({ _id: id })
  if (!product) {
    throw new BadRequestError('Not found delete to update')
  }

  return res.status(200).send({ success: true, data: { id, name: product.name } })
}

const getListCategory = async (req, res) => {
  const listCategory = await Category.find({})

  res.status(200).send(listCategory)
}

const getCategory = async (req, res) => {
  const { id } = req.params

  const category = await Category.findOne({ _id: id })

  res.status(200).send({ success: true, data: category })
}

const createCategory = async (req, res) => {
  const { name, description, status = 1 } = req.body
  const newCategory = new Category({
    name, description, status
  })

  await newCategory.save()

  return res.status(201).send({ success: true, data: newCategory })
}

const updateCategory = async (req, res) => {
  const { id } = req.params

  const { name, description, status } = req.body

  const category = await Category.findOneAndUpdate({ _id: id }, { name, description, status }, {
    new: true
  })

  if (!category) {
    throw new BadRequestError('Not found category to update')
  }

  return res.status(200).send({ success: true, data: { name, description, status } })
}

const deleteCategory = async (req, res) => {
  const { id } = req.params

  const category = await Category.findOneAndDelete({ _id: id })
  if (!category) {
    throw new BadRequestError('Not found category to update')
  }

  return res.status(200).send({ success: true, data: { id, name: category.name } })
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getListCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory
}
