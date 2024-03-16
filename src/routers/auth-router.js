const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth-controller')
const { body } = require('express-validator')
const { validateRequest } = require('../middlewares/validate-request')

const validateEmpty = () => {
  return body('*').trim().notEmpty()
}

router.post('/login', validateEmpty(), validateRequest, authController.login)

router.post('/register', validateEmpty(), validateRequest, authController.register)

module.exports = router
