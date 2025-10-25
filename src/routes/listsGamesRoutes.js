const express = require('express');
const router = express.Router();
const listGameController = require('../controllers/listGameController');
const {verifyToken} = require('@/middlewares/authMiddleware');

router.get('/:id', verifyToken, listGameController.getGamesList);
router.post('/:id', verifyToken, listGameController.addGamesToList);
router.delete('/:id', verifyToken, listGameController.removeGamesFromList);

module.exports = router;