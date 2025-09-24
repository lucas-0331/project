const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesControllers');

router.get('/', gamesController.getAllGames);

module.exports = router;