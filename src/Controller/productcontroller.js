const productService = require('../services/productservice');

const createProduct = async (req, res) => {
    // const product = await req.params.id;
    try {
        const Product = await productService.createProduct(req.body);
        res.status(200).send(Product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await productService.deleteProduct(productId);
        res.status(200).send({ message: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


const updateProduct = async (req, res) => {
    const product = await req.params.id;
    try {
        const Product = await productService.updateProduct(product, req.body);
        res.status(200).send(Product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const findProductById = async (req, res) => {
    const productId = req.params.id;
    if (!productId || productId === 'undefined') {
        return res.status(400).send({ error: 'Product ID is required' });
    }
    try {
        const product = await productService.findProductById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    const product = await req.query;
    try {
        const Product = await productService.getAllProducts(product);
        res.status(200).send(Product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const createMultipleProduct = async (req, res) => {
    const product = await req.query;
    try {
        const Product = await productService.createMultipleProduct(req.body);
        res.status(200).send({ message: 'Product created successfully', Product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { createProduct, deleteProduct, updateProduct, findProductById, getAllProducts, createMultipleProduct }