const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/all', userController.getAllUserInfor);
router.get('/:mssv', userController.getUserInfor);
router.post('/login', userController.login);
router.post('/login/name', userController.insertName);

module.exports = router;
