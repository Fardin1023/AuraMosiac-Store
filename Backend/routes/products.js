const { Category } = require('../models/category');
const { Product } = require('../models/products');
const Order = require('../models/order'); // for verified purchase check
const auth = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

/* ======================
   PRODUCT ROUTES
   ====================== */

// ✅ Get all products (with category populated)
router.get('/', async (req, res) => {
  try {
    const productList = await Product.find().populate('category');
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get products by category ID
router.get('/getByCategory/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category');
    if (!products || products.length === 0) return res.status(404).json({ message: 'No products found' });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get products by category NAME directly (one-hop, case-insensitive)
router.get('/byCategoryName/:name', async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.name || '');
    const want = raw.replace(/-/g, ' ').trim();

    // case-insensitive exact match on name after trimming
    const cat = await Category.findOne({
      name: { $regex: `^\\s*${want}\\s*$`, $options: 'i' },
    });

    if (!cat) return res.status(404).json({ message: `Category not found for name: ${raw}` });

    const products = await Product.find({ category: cat._id }).populate('category');
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------
   ✅ Powerful search with filters & sorting
   GET /api/products/search
   Query params:
     - categoryName: string (e.g. "Skincare")
     - brands: comma-separated (e.g. "A,B,C")
     - minPrice, maxPrice: numbers
     - minRating: number (0..5)
     - inStock: "true" to only show stock > 0
     - sort: "price_asc" | "price_desc" | "rating_desc" | "newest"
     - page: 1-based (default 1)
     - limit: default 20
   Response: { items, total, page, pages }
------------------------------------------------- */
router.get('/search', async (req, res) => {
  try {
    let {
      categoryName,
      brands,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort,
      page,
      limit,
    } = req.query;

    // defaults
    page = Math.max(parseInt(page || '1', 10), 1);
    limit = Math.min(Math.max(parseInt(limit || '20', 10), 1), 100);

    const filter = {};

    // Category by name (case-insensitive exact match after trim)
    if (categoryName && String(categoryName).trim()) {
      const raw = decodeURIComponent(String(categoryName));
      const want = raw.replace(/-/g, ' ').trim();

      const cat = await Category.findOne({
        name: { $regex: `^\\s*${want}\\s*$`, $options: 'i' },
      });

      // If category provided but not found, return empty results (200)
      if (!cat) {
        return res.json({ items: [], total: 0, page, pages: 0 });
      }
      filter.category = cat._id;
    }

    // Brands (comma-separated)
    if (brands) {
      const arr = String(brands)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) {
        filter.brand = { $in: arr };
      }
    }

    // Price range
    const priceQuery = {};
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      priceQuery.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      priceQuery.$lte = Number(maxPrice);
    }
    if (Object.keys(priceQuery).length) {
      filter.price = priceQuery;
    }

    // Minimum rating (“quality”)
    if (minRating !== undefined && !isNaN(Number(minRating))) {
      filter.rating = { $gte: Math.max(0, Math.min(5, Number(minRating))) };
    }

    // In stock only
    if (String(inStock).toLowerCase() === 'true') {
      filter.countInStock = { $gt: 0 };
    }

    // sorting
    let sortObj = { price: 1 }; // default price ascending
    switch (String(sort || '').toLowerCase()) {
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating_desc':
        sortObj = { rating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'price_asc':
      default:
        sortObj = { price: 1 };
    }

    const total = await Product.countDocuments(filter);
    const items = await Product.find(filter)
      .populate('category')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    return res.json({ items, total, page, pages });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Get products by subcategory ID
router.get('/getBySubcategory/:categoryId/:subId', async (req, res) => {
  try {
    const { categoryId, subId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const subcategory = category.subcategories.id(subId);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    const products = await Product.find({ _id: { $in: subcategory.products } }).populate('category');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get product count
router.get('/get/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get featured products (limit by count)
router.get('/get/featured/:count', async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count).populate('category');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get related products by category (exclude current product)
router.get('/related/:categoryId/:excludeId', async (req, res) => {
  try {
    const { categoryId, excludeId } = req.params;
    const products = await Product.find({
      category: categoryId,
      _id: { $ne: excludeId },
    })
      .limit(10)
      .populate('category');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching related products' });
  }
});

/* ======================
   ⭐ Reviews Endpoints
   ====================== */

// Get reviews for a product (plus aggregates)
router.get('/:id/reviews', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id).select('reviews rating numReviews');
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    res.json({ reviews: prod.reviews || [], rating: prod.rating || 0, numReviews: prod.numReviews || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a review (auth required, one review per user)
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body || {};
    const rateNum = Number(rating);

    if (!rateNum || rateNum < 1 || rateNum > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const already = (product.reviews || []).some((r) => String(r.user) === String(req.user.id));
    if (already) return res.status(400).json({ message: 'You have already reviewed this product.' });

    // Did the user purchase this product? (any non-cancelled order)
    const purchased = await Order.findOne({
      user: req.user.id,
      'items.productId': product._id,
      status: { $ne: 'cancelled' },
    }).lean();

    const newReview = {
      user: req.user.id,
      name: req.user.name || req.user.email || 'User',
      rating: rateNum,
      comment: (comment || '').toString().trim(),
      verifiedPurchase: Boolean(purchased),
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
      Math.max(1, product.reviews.length);

    await product.save();

    res.status(201).json({
      message: 'Review added',
      review: newReview,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete own review
router.delete('/:pid/reviews/:rid', auth, async (req, res) => {
  try {
    const { pid, rid } = req.params;
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(rid);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (String(review.user) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not allowed to delete this review' });
    }

    review.remove();
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
          product.reviews.length;

    await product.save();
    res.json({ message: 'Review removed', rating: product.rating, numReviews: product.numReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single product by ID (keep last so it doesn't shadow above routes)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found!' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update product (assign category + subcategory, edit details)
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: 'Invalid Category' });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock,
        images: req.body.images || [],
        brand: req.body.brand || '',
        rating: req.body.rating || 0,
        numReviews: req.body.numReviews || 0,
        category: req.body.category,
        isFeatured: req.body.isFeatured || false,
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    // ✅ If subcategory provided, update its product list
    if (req.body.subcategoryId) {
      const subcategory = category.subcategories.id(req.body.subcategoryId);
      if (subcategory && !subcategory.products.includes(updatedProduct._id)) {
        subcategory.products.push(updatedProduct._id);
        await category.save();
      }
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new product (link to category + optional subcategory)
router.post('/create', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: 'Invalid Category' });

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      countInStock: req.body.countInStock,
      images: req.body.images || [],
      brand: req.body.brand || '',
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      category: req.body.category,
      isFeatured: req.body.isFeatured || false,
    });

    product = await product.save();

    // ✅ If subcategory provided, attach product there too
    if (req.body.subcategoryId) {
      const subcategory = category.subcategories.id(req.body.subcategoryId);
      if (subcategory) {
        subcategory.products.push(product._id);
        await category.save();
      }
    }

    if (!product) return res.status(500).json({ message: 'The product cannot be created' });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete product (and remove from subcategory if exists)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ✅ Clean up product from any subcategory arrays
    await Category.updateMany(
      { 'subcategories.products': product._id },
      { $pull: { 'subcategories.$[].products': product._id } }
    );

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
