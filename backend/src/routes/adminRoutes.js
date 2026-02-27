const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/request-code', adminController.requestCode);
router.post('/validate-code', adminController.validateCode);

module.exports = router;
