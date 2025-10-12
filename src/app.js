const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes/routes');

const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Bem-vindo à API Vapor, acesse /api para os recursos.',
        version: '1.0'
    });
});

app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;