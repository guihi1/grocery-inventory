const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    description: String,
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

module.exports = mongoose.model('Category', CategorySchema);
