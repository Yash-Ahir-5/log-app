const express = require('express');
const { sendFolders , uploadDoc, fileStatus} = require('../controllers/pC');
// const { sendFolders, uploadDoc } = require('../controllers/productController');

const router = express();

router.get('/', sendFolders);
router.get('/file/:folderName', uploadDoc);
router.get('/filestatus', fileStatus);

module.exports = router