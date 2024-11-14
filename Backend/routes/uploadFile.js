const express = require('express');
const router = express.Router();


const {uploadImageToCloudinary}=require('../controllers/uploadController')

router.post('/',uploadImageToCloudinary)

module.exports = router;