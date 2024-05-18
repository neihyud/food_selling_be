const express = require('express')
const router = express.Router()

const productController = require('../controllers/product-controller')

router.get('/top-rate-product', productController.getRateProduct)
router.get('/top-popular-product', productController.getTopProductPopular)

module.exports = router
