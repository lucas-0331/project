const listController = require('../controllers/listController');
const express = require('express');

const listRouter = express.Router();

listRouter.get('/', listController.all);
listRouter.post('/', listController.create);
listRouter.put('/:id', listController.update);
listRouter.delete('/:id', listController.remove);

module.exports = listRouter;