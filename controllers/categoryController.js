const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../model/category');
const Item = require('../model/item');

// Display list of all categorys.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'Category',
    category_list: allCategories,
  });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  res.render('category_detail', {
    category,
    items: itemsInCategory,
  });
});

// Display category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Add Category' });
});

// Handle category create on POST.
exports.category_create_post = [
  // Validation
  body('name', 'Category name must have at least 2 characters.')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Description must have at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    // When there are errors, render form again with error messages and previous values
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Add Category',
        category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  },
];

// Handle category delete on POST.
exports.category_delete_post = [
  body('password').trim().escape(),

  asyncHandler(async (req, res, next) => {
    if (req.body.password === process.env.PASSWORD) {
      await Category.findByIdAndDelete(req.params.id).exec();
    }
    res.redirect('/category');
  }),
];

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: category update GET');
});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: category update POST');
});
