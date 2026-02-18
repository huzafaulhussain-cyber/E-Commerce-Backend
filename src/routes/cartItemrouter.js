const express = require('express')
const router = express.Router()

const cartItemcontroller = require('../Controller/cartItemcontroller.js')
const {authenticate} = require('../middleware/authenticate.js')



router.put('/:id', authenticate, cartItemcontroller.updateCartItem)
router.delete('/:id', authenticate, cartItemcontroller.removeCartItem)


module.exports = router; 