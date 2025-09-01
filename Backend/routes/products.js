const {Category} = require('../models/category');
const {Product} = require('../models/products');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

// ✅ Get all products (with category populated)
router.get('/', async (req, res) => {
    try {
        const productList = await Product.find().populate("category");
        res.status(200).json(productList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// ✅ Get products by category ID
router.get('/getByCategory/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId }).populate("category");
        if (!products) return res.status(404).json({ message: "No products found" });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        if (!product) return res.status(404).json({ message: "Product not found!" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get product count
router.get('/get/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get featured products (limit by count)
router.get('/get/featured/:count', async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await Product.find({ isFeatured: true }).limit(+count).populate("category");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get related products by category (exclude current product)
router.get("/related/:categoryId/:excludeId", async (req, res) => {
    try {
        const { categoryId, excludeId } = req.params;
        const products = await Product.find({
            category: categoryId,
            _id: { $ne: excludeId }, // exclude current product
        }).limit(10).populate("category");

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching related products" });
    }
});

// ✅ Update product (assign category, edit details)
router.put('/:id', async (req, res) => {
    try {
        // check if category exists
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).json({ message: 'Invalid Category' });

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                countInStock: req.body.countInStock,
                images: req.body.images || [],   // ✅ multiple images
                brand: req.body.brand || "",     // ✅ brand
                rating: req.body.rating || 0,    // ✅ rating
                numReviews: req.body.numReviews || 0, // ✅ reviews
                category: req.body.category,     // categoryId from frontend
                isFeatured: req.body.isFeatured || false,
            },
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Create new product
router.post('/create', async (req, res) => {
    try {
        // check if category exists
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).json({ message: 'Invalid Category' });

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            countInStock: req.body.countInStock,
            images: req.body.images || [],   // ✅ handle multiple images
            brand: req.body.brand || "",     // ✅ handle brand
            rating: req.body.rating || 0,    // ✅ default rating
            numReviews: req.body.numReviews || 0, // ✅ default reviews
            category: req.body.category,
            isFeatured: req.body.isFeatured || false
        });

        product = await product.save();

        if (!product) return res.status(500).json({ message: 'The product cannot be created' });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ✅ Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
