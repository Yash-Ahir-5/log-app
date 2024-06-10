const express = require('express');
const { sendFolders , uploadDoc} = require('../controllers/pC');
// const { sendFolders, uploadDoc } = require('../controllers/productController');

const router = express();

router.get('/', sendFolders);
router.post('/file', uploadDoc);

module.exports = router