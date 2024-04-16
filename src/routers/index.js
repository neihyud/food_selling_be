const express = require('express')
const router = express.Router()

const authRouter = require('./auth-router')
const productRouter = require('./admin-product-router')
const accountRouter = require('./account-router')
const orderRouter = require('./order-router')
const userRouter = require('./user-router')
const categoryRouter = require('./category-router')
const chatRouter = require('./chat-router')

const { verifyToken } = require('../middlewares/verify-token')

router.use('/auth', authRouter)
router.use('/', verifyToken)
router.use('/admin/manage-product', productRouter)
router.use('/admin/account', accountRouter)
router.use('/admin/chat', chatRouter)
router.use('/user', userRouter)
router.use('/', orderRouter)
router.use('/category', categoryRouter)
router.use('/chat', chatRouter)

module.exports = router
