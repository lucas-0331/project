const express = require('express');
const router = express.Router();

const gamesRoutes = require('./gamesRoutes');
const userRoutes = require('./usersRoutes');
const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gamesRoutes);

module.exports = router;