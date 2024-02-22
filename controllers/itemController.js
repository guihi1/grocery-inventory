const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Item = require('../model/item');
const Category = require('../model/category');

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}).sort({ name: 1 }).exec();
  res.render('item_list', { title: 'Items', item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();
  res.render('item_detail', { item });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('item_form', { title: 'Add Item', categories: allCategories });
});

// Handle item create on POST.
exports.item_create_post = [
  // Validation
  body('name', 'Item name must have at least 2 characters.')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Description must have at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('price', 'Invalid price.').trim().isNumeric(),
  body('category', 'Category must not be empty.').trim().notEmpty().escape(),
  body('stock', 'Must be a number.').trim().isNumeric(),
  body('password', 'Wrong password.').custom(
    (value) => value === process.env.PASSWORD
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    });

    // When there are errors, render form again with error messages and previous values
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();
      res.render('item_form', {
        title: 'Add Item',
        item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Handle item delete on POST.
exports.item_delete_post = [
  body('password').trim().escape(),

  asyncHandler(async (req, res, next) => {
    if (req.body.password === process.env.PASSWORD) {
      await Item.findByIdAndDelete(req.params.id).exec();
    }
    res.redirect('/item');
  }),
];

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);
  res.render('item_form', {
    title: 'Update Item',
    item,
    categories: allCategories,
  });
});

// Handle item update on POST.
exports.item_update_post = [
  // Validation
  body('name', 'Item name must have at least 2 characters.')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Description must have at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('price', 'Invalid price.').trim().isNumeric(),
  body('category', 'Category must not be empty.').trim().notEmpty().escape(),
  body('stock', 'Must be a number.').trim().isNumeric(),
  body('password', 'Wrong password.').custom(
    (value) => value === process.env.PASSWORD
  ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      _id: req.params.id,
    });

    // When there are errors, render form again with error messages and previous values
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();
      res.render('item_form', {
        title: 'Update Item',
        item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
