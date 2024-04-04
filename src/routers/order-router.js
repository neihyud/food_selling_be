const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order-controller')

router.post('/create-checkout-session', orderController.createCheckoutSession)

module.exports = router
