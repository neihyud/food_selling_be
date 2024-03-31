const express = require('express')
const router = express.Router()

const authRouter = require('./auth-router')
const productRouter = require('./product-router')
const accountRouter = require('./account-router')

router.use('/auth', authRouter)
router.use('/admin/manage-product', productRouter)
router.use('/admin/account', accountRouter)

module.exports = router
