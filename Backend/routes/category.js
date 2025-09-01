const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

// ✅ Get all categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        res.status(200).json(categoryList);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// ✅ Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get category by name
router.get('/getByName/:name', async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.name });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Get total category count
router.get('/get/count', async (req, res) => {
    try {
        const count = await Category.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// ✅ Create new category
router.post('/create', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            images: req.body.images || [],
            color: req.body.color || "default"
        });

        category = await category.save();

        if (!category) return res.status(500).json({ message: 'The category cannot be created' });

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update category
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                images: req.body.images || [],
                color: req.body.color || "default"
            },
            { new: true }
        );

        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
