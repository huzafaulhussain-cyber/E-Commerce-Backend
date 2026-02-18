const express = require('express')
const router = express.Router()

const cartcontroller= require('../Controller/cartcontroller.js')
const {authenticate} = require('../middleware/authenticate.js')



router.get('/', authenticate, cartcontroller.findUserCart)
router.put('/add', authenticate, cartcontroller.addItemToCart)
 

module.exports = router;