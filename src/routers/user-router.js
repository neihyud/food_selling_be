const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/address', userController.getListAddressUser)
router.post('/address', userController.createAddress)
router.put('/address/:id', userController.updateAddress)
router.get('/address/:id', userController.getAddress)

module.exports = router
