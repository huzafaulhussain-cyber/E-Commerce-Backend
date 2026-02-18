const express = require('express');
const router = express.Router();
const catController = require('../Controller/categoryController');

router.post('/update-logo', catController.updateLogo);
router.get('/get-logo', catController.getLogo);

// Existing Category Routes
router.post('/add', catController.createCategory);
router.get('/navigation', catController.getNavigationTree);
router.get('/list', catController.getList);
router.put('/update-banners', catController.updateBanners);
router.delete('/:id', catController.deleteCategory);
router.put('/:id', catController.updateCategory);

module.exports = router; 
