const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

const gamesRoutes = require('./routes/gamesRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/games', gamesRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Olá, mundo! API está funcionando!');
});

module.exports = app;