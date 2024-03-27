const express = require('express')
const router = express.Router()
const upload = require('../config/multer')

const productController = require('../controllers/product-controller')

router.get('/product', productController.getProducts)

router.post('/product', upload.single('img'), productController.createProduct)

router.get('/product/:id', productController.getProduct)
router.put('/product/:id', productController.updateProduct)
router.delete('product/:id', productController.deleteProduct)

router.get('/category', productController.getListCategory)
router.post('/category', productController.createCategory)
router.get('/category/:id', productController.getCategory)
router.put('/category/:id', productController.updateCategory)
router.delete('/category/:id', productController.deleteCategory)

module.exports = router
