const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, image, link, price, description, category } = req.body;

    try {
        const newProduct = new Product({
            title,
            image,
            link,
            price,
            description,
            category
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateProduct = async (req, res) => {
    const { title, image, link, price, description, category } = req.body;

    const productFields = {};
    if (title) productFields.title = title;
    if (image) productFields.image = image;
    if (link) productFields.link = link;
    if (price) productFields.price = price;
    if (description) productFields.description = description;
    if (category) productFields.category = category;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.trackProductClick = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.clicks += 1;
        await product.save();

        res.json(product.clicks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
