const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order-controller')

router.get('/', orderController.getListOrderAdmin)
router.put('/:id', orderController.updateOrder)
router.get('/pending', orderController.getListOrderAdminPend)
router.get('/delivered', orderController.getListOrderAdminDelivered)
router.get('/declined', orderController.getListOrderAdminDeclined)
router.get('/in-process', orderController.getListOrderAdminInProcess)
router.get('/tody', orderController.getListOrderAdminToday)

module.exports = router
