const express = require('express')
const router = express.Router()

const productcontroller = require('../Controller/productcontroller.js')
const {authenticate} = require('../middleware/authenticate.js')

router.post('/', authenticate, productcontroller.createProduct)
router.post('/creates', authenticate, productcontroller.createMultipleProduct)
router.delete('/:id', authenticate, productcontroller.deleteProduct)
router.put('/:id', authenticate, productcontroller.updateProduct)
 
 

module.exports = router;