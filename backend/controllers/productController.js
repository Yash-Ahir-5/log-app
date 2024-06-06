const sequelize = require('../utils/db');

const welcome = (req, res) => {
    res.send("Hello World.");
}

module.exports = {
    welcome
}