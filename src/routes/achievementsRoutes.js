const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const {verifyToken} = require('@/middlewares/authMiddleware');

router.get('/:id', verifyToken, achievementController.getAchievementsList);
router.post('/:id', verifyToken, achievementController.addAchievementsToList);
router.delete('/:id', verifyToken, achievementController.removeAchievementsFromList);

module.exports = router;