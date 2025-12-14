const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');
const {verifyToken} = require('@/middlewares/authMiddleware');

router.get('/', verifyToken, avatarController.getAvatars);
// router.post('/', verifyToken, avatarController.saveAvatar);
// router.put('/:id', verifyToken, avatarController.updateAvatar);
// router.delete('/:id', verifyToken, avatarController.deleteAvatar);

module.exports = router;