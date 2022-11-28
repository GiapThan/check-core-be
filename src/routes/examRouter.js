const express = require('express');
const router = express.Router();
const examController = require('../controller/examController');

router.get('/:chuong/:lesson', examController.getBaiTap);
router.get('/manage/:chuong/:lesson', examController.getBaiTapManage);
router.get('/reload/:chuong/:lesson', examController.getReLoadListSignIn);
router.post('/create', examController.createBaiTap);
router.post('/signin', examController.signInBaiTap);
router.post('/change', examController.changeOpen);

module.exports = router;
