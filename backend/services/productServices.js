const Product = require('../models/ProductModel');

const getAllProducts = async () => {
    try {
        const products = await Product.findAll();
        console.log("Products:", products); // Logging the fetched products
        console.log("Are all products instances of Product:", products.every(product => product instanceof Product));
        return products;
    } catch (error) {
        console.error("Error getting products : ", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

module.exports = {
    getAllProducts
}