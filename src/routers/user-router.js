const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const upload = require('../config/multer')

router.get('/address', userController.getListAddressUser)
router.post('/address', userController.createAddress)
router.put('/address/:id', userController.updateAddress)
router.get('/address/:id', userController.getAddress)
router.delete('/address/:id', userController.deleteAddress)
router.get('/', userController.getUser)
router.post('/', upload.single('img'), userController.updateUser)

router.put('/password', userController.updatePassword)

module.exports = router
