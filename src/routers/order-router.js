const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order-controller')

router.post('/create-checkout-session', orderController.createCheckoutSession)
router.post('/stripe-success', orderController.stripeSuccess)
router.get('/order', orderController.getListOrder)
router.get('/order/:id', orderController.getOrder)
router.get('/order/:orderId/item', orderController.getListOrderItem)

module.exports = router
