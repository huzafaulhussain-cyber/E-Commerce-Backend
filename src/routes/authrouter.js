const express = require('express')
const router = express.Router()
const authController = require('../Controller/authcontroller.js')

router.post('/signup', authController.register)
router.post('/signin', authController.login)

module.exports = router;