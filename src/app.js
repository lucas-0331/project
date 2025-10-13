const express = require('express');
const fs = require('fs');
const cors = require('cors');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes/routes');
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

module.exports = app;