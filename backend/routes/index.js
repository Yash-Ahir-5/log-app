const express = require('express');
const { welcome } = require('../controllers/productController');
const router = express();

router.get('/', welcome);


module.exports = router