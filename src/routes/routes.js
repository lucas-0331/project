const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./usersRoutes');
const gamesRoutes = require('./gamesRoutes');
const listsRoutes = require('./listsRoutes');
const listsGamesRoutes = require('./listsGamesRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gamesRoutes);
router.use('/lists', listsRoutes);
router.use('/games-lists', listsGamesRoutes);

module.exports = router;