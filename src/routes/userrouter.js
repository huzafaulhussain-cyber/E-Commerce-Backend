const express = require('express')
const router = express.Router()
const userController = require('../Controller/usercontroller.js')
const { authenticate } = require('../middleware/authenticate.js');
const isAdmin = require('../middleware/isAdmin.js'); // <--- Naya middleware import kiya

router.get('/profile', authenticate, userController.getUserProfile)

// 2. Saaray users ki list sirf ADMIN dekh sakta hai
router.get('/', authenticate, isAdmin, userController.getAllUsers)

// 3. User ko delete sirf ADMIN kar sakta hai
router.delete("/:userId", authenticate, isAdmin, userController.deleteUser);
 

module.exports = router;

// const express = require('express')
// const router = express.Router()
// const userController = require('../Controller/usercontroller.js')
// const { authenticate } = require('../middleware/authenticate.js');
// const isAdmin = require('../middleware/isAdmin.js'); // <--- Naya middleware import kiya

// // 1. Apna profile koi bhi dekh sakta hai jo login ho
// router.get('/profile', authenticate, userController.getUserProfile)

// // 2. Saaray users ki list sirf ADMIN dekh sakta hai
// router.get('/', authenticate, isAdmin, userController.getAllUsers)

// // 3. User ko delete sirf ADMIN kar sakta hai
// router.delete("/:userId", authenticate, isAdmin, userController.deleteUser);

// module.exports = router;