const app = require('express')();
const PORT = 3000;

app.listen(
  PORT,
  () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/', (req, res) => {
  res.send('Olá, mundo! Sua API está funcionando!');
});

app.get('/test', (req, res) => {
  res.status(200).send({
    label: 'Hello World',
    status: 'success',
  });
});