const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const {verifyToken} = require('@/middlewares/authMiddleware');

router.get('/', verifyToken, listController.getLists);
router.post('/', verifyToken, listController.createList);
router.put('/:id', verifyToken, listController.updateList);
router.delete('/:id', verifyToken, listController.deleteList);

module.exports = router;