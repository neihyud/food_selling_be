const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth-controller')
const { body } = require('express-validator')
const { validateRequest } = require('../middlewares/validate-request')

const validateEmpty = () => {
  return [
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty()
  ]
}

router.post('/admin/login', validateEmpty(), validateRequest, authController.login)

router.post('/register', validateEmpty(), validateRequest, authController.register)
router.post('/login', authController.loginUser)

module.exports = router
