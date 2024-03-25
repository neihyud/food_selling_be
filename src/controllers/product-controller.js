const { BadRequestError } = require('../errors/bad-request-error')
const Category = require('../models/Category')
const Product = require('../models/Product')

const getProducts = (req, res) => {

}

const getProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findOne({ _id: id })

  res.status(200).send(product)
}

const createProduct = (req, res) => {

}

const updateProduct = (req, res) => {

}

const deleteProduct = (req, res) => {

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
