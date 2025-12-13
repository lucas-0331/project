const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const {verifyToken} = require('@/middlewares/authMiddleware');

router.get('/', verifyToken, gameController.getGames);
router.get('/:appId/details', verifyToken, gameController.getDetails);

module.exports = router;