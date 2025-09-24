const express = require('express');
const app = express();

const gamesRoutes = require('./routes/gamesRoutes');

app.use(express.json());

app.use('/games', gamesRoutes);

app.get('/', (req, res) => {
  res.send('Olá, mundo! Sua API está funcionando!');
});

module.exports = app;