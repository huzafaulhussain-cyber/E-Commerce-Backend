const express = require('express')
const router = express.Router()

const ordercontroller = require('../Controller/ordercontroller.js')
const { authenticate } = require('../middleware/authenticate.js')

// 1. Create Order
router.post('/', authenticate, ordercontroller.createorder)

router.get('/user', authenticate, ordercontroller.userOrderHistory)
router.get('/:id', authenticate, ordercontroller.findOrderById)


module.exports = router;