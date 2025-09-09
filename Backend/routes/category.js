const { Category } = require('../models/category');
const { Product } = require('../models/products');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
});

/* ======================
   CATEGORY ROUTES
   ====================== */

// ✅ Get all categories (with subcategories)
router.get('/', async (req, res) => {
  try {
    const categoryList = await Category.find();
    res.status(200).json(categoryList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get category by NAME (case-insensitive; supports hyphens/spaces)
router.get('/getByName/:name', async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.name || '');
    const want = raw.replace(/-/g, ' ').trim().toLowerCase();

    const cats = await Category.find({}, { name: 1, icon: 1, color: 1, images: 1, subcategories: 1 });
    const match = cats.find((c) => (c.name || '').trim().toLowerCase() === want);

    if (!match) {
      return res.status(404).json({ message: `Category not found for name: ${raw}` });
    }
    return res.status(200).json(match);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new category
router.post('/create', async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      color: req.body.color || "default",
      icon: req.body.icon || "",
      subcategories: []
    });

    category = await category.save();
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
        color: req.body.color,
        icon: req.body.icon
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

/* ======================
   SUBCATEGORY ROUTES
   ====================== */

// ✅ Add subcategory to a category
router.post('/:categoryId/subcategories', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories.push({ name: req.body.name });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update subcategory
router.put('/:categoryId/subcategories/:subId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.id(req.params.subId);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    subcategory.name = req.body.name || subcategory.name;

    await category.save();
    res.status(200).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete subcategory (and unlink products)
router.delete('/:categoryId/subcategories/:subId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.id(req.params.subId);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    // Remove subcategory from category
    subcategory.remove();
    await category.save();

    // ✅ Unlink products that had this subcategory
    await Product.updateMany(
      { subcategory: req.params.subId },
      { $set: { subcategory: null } }
    );

    res.status(200).json({ message: "Subcategory deleted and products unlinked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all subcategories of a category
router.get('/:categoryId/subcategories', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category.subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
