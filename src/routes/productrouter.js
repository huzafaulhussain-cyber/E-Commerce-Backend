const express = require('express')
const router = express.Router()

const productcontroller = require('../Controller/productcontroller.js')
const { authenticate } = require('../middleware/authenticate.js')

router.get('/', productcontroller.getAllProducts) // Ye ab public hai
router.get('/:id',  productcontroller.findProductById)
router.delete('/:id', authenticate, productcontroller.deleteProduct)


module.exports = router;