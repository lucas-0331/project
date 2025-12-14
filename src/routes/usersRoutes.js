const express = require('express');
const router = express.Router();
const userController = require('@/controllers/userController');
const {verifyToken} = require('@/middlewares/authMiddleware');
const {isAdmin} = require('@/middlewares/adminMiddleware');

router.get('/', [verifyToken, isAdmin], userController.getAllUser);
router.get('/me', verifyToken, userController.getUserDetails);
router.post('/register', userController.storeUser);
router.put('/:id', verifyToken, userController.updateUser);

module.exports = router;