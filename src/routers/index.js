const express = require('express')
const router = express.Router()

const authRouter = require('./auth-router')
const productRouter = require('./product-router')
const accountRouter = require('./account-router')
const orderRouter = require('./order-router')
const userRouter = require('./user-router')
const { verifyToken } = require('../middlewares/verify-token')

router.use('/auth', authRouter)
router.use('/', verifyToken)
router.use('/admin/manage-product', productRouter)
router.use('/admin/account', accountRouter)
router.use('/user', userRouter)
router.use('/', orderRouter)

module.exports = router
