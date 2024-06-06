const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'product',
    timestamps: false
});

// Sync the table only if it doesn't exist
(async () => {
    try {
        // const existingProductTable = false;
        if (!existingProductTable) {
            await product.sync();
            console.log("Product table created successfully.");
        } else {
            console.log("Product table already exists.");
        }
    } catch (error) {
        console.error("Error checking or creating Product table:", error);
    }
})();

module.exports = product;