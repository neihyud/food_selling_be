const express = require('express')
const router = express.Router()

const accountController = require('../controllers/account-controller')

router.get('/', accountController.getListStaff)
router.post('/', accountController.createStaff)
router.get('/:id', accountController.getStaff)
router.put('/:id', accountController.updateStaff)
router.delete('/:id', accountController.deleteStaff)

module.exports = router
