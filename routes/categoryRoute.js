const express = require('express');
const path = require('path');

const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.use(
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))
);

// GET request for creating a category. NOTE This must come before routes that display category (uses id).
router.get('/create', categoryController.category_create_get);

// POST request for creating category.
router.post('/create', categoryController.category_create_post);

// GET request to delete category.
router.get('/:id/delete', categoryController.category_delete_get);

// POST request to delete category.
router.post('/:id/delete', categoryController.category_delete_post);

// GET request to update category.
router.get('/:id/update', categoryController.category_update_get);

// POST request to update category.
router.post('/:id/update', categoryController.category_update_post);

// GET request for one category.
router.get('/:id', categoryController.category_detail);

// GET request for list of all categories.
router.get('/', categoryController.category_list);

module.exports = router;
