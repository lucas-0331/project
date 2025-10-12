const express = require('express');
const router = express.Router();
const userController = require('@/controllers/userController');
const {verifyToken} = require('@/middlewares/authMiddleware');
const {isAdmin} = require('@/middlewares/adminMiddleware');

router.get('/', [verifyToken, isAdmin], userController.getAllUser);
router.post('/store', userController.storeUser);

module.exports = router;