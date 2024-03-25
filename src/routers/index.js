const express = require('express')
const router = express.Router()

const authRouter = require('./auth-router')
const productRouter = require('./product-router')

router.use('/auth', authRouter)
router.use('/admin/manage-product', productRouter)

module.exports = router
