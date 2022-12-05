const express = require('express');
const router = express.Router();
const diemController = require('../controller/diemController');

router.post('/insert', diemController.insert);
router.put('/inc', diemController.incDiem);
router.put('/dec', diemController.decDiem);

module.exports = router;
