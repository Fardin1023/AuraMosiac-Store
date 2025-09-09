const mongoose = require('mongoose');

/* ---------- Review subdocument ---------- */
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, default: '' }, // snapshot of user’s name at review time
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    brand: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    // ✅ optional subcategory reference
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category.subcategories',
      required: false
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 1000
    },

    /* ---------- Ratings & Reviews ---------- */
    reviews: [reviewSchema],                // list of reviews
    rating: { type: Number, default: 0, min: 0, max: 5 }, // average rating
    numReviews: { type: Number, default: 0 },

    isFeatured: {
      type: Boolean,
      default: false
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", productSchema);
