const express = require('express');
const router = express.Router();

const gamesRoutes = require('./gamesRoutes');
const listsRoutes = require('./listsRoutes');
const userRoutes = require('./usersRoutes');
const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gamesRoutes);
router.use('/lists', listsRoutes);

module.exports = router;