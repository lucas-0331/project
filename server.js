const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Olá, mundo! Sua API está funcionando!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});