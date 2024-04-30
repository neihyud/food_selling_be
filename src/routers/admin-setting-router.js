const express = require('express')
const router = express.Router()

const settingController = require('../controllers/setting-controller')
const upload = require('../config/multer')

router.get('/slider', settingController.getListSlider)
router.get('/slider/:id', settingController.getSlider)
router.post('/slider', upload.single('img'), settingController.createSlider)
router.put('/slider/:id', settingController.updateSlider)
router.delete('/slider/:id', settingController.deleteSlider)

module.exports = router
