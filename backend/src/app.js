const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'API Biblioteca Virtual' });
});

const path = require('path');

// Servir arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback para React Router (SPA)
app.get('*', (req, res, next) => {
  // Se for rota da API, deixa passar
  if (req.originalUrl.startsWith('/books') || req.originalUrl.startsWith('/health')) {
    return next();
  }

  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor', mensagem: err.message });
});

module.exports = app;
