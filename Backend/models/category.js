const mongoose = require('mongoose');

// ✅ Subcategory schema
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // link products directly
      },
    ],
  },
  { _id: true }
);

// ✅ Category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // category names should be unique
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'default',
    },
    images: [
      {
        type: String,
        default: '',
      },
    ],
    subcategories: [subcategorySchema], // embed subcategories
  },
  { timestamps: true }
);

exports.Category = mongoose.model('Category', categorySchema);
