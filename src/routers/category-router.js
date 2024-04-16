const express = require('express')
const router = express.Router()

const productController = require('../controllers/product-controller')
router.get('/:id/product', productController.getProductByCategoryId)
router.get('/', productController.getListCategory)

module.exports = router
