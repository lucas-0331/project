const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./usersRoutes');
const gamesRoutes = require('./gamesRoutes');
const listsRoutes = require('./listsRoutes');
const listsGamesRoutes = require('./listsGamesRoutes');
const achievementsRoutes = require('./achievementsRoutes');
const avatarsRoutes = require('./avatarsRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gamesRoutes);
router.use('/lists', listsRoutes);
router.use('/games-lists', listsGamesRoutes);
router.use('/achievements', achievementsRoutes);
router.use('/avatars', avatarsRoutes);

module.exports = router;