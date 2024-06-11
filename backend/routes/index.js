const express = require('express');
const { sendFolders , uploadDoc} = require('../controllers/pC');
// const { sendFolders, uploadDoc } = require('../controllers/productController');

const router = express();

router.get('/', sendFolders);
router.get('/file/:folderName', uploadDoc);

module.exports = router