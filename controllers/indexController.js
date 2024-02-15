const asyncHandler = require('express-async-handler');
const Category = require('../model/category');
const Item = require('../model/item');

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Grocery Inventory Home',
    item_count: numItems,
    category_count: numCategories,
  });
});
