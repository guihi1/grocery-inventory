const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    description: String,
    price: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    stock: Number,
  },
  {
    virtuals: {
      url: {
        get() {
          return `/items/${this._id}`;
        },
      },
    },
  }
);

module.exports = mongoose.model('Item', ItemSchema);
