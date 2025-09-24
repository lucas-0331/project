const express = require('express');
const app = express();

const gamesRoutes = require('./routes/gamesRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use(express.json());

app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Olá, mundo! Sua API está funcionando!');
});

module.exports = app;