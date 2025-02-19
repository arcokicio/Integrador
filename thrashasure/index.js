const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());

// Conexão com o banco de dados MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: 'admin',   
  database: 'coleta_produtos',   
});

db.connect(err => {
  if (err) {
    console.error('Erro de conexão:', err.stack);
    return;
  }
  console.log('Conectado!');
});

// Rotas

// Rota para cadastrar um posto de coleta
app.post('/cadastraColeta', (req, res) => {
  const { nome, endereco, latitude, longitude } = req.body;

  const query = 'INSERT INTO postoColeta (nome, endereco, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, endereco, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar posto de coleta:', err);
      return res.status(500).send('Erro ao cadastrar posto de coleta');
    }

    res.status(201).json({
      id: result.insertId,
      nome,
      endereco,
      latitude,
      longitude,
    });
  });
});

// Rota para listar todos postos de coleta
app.get('/listaColeta', (req, res) => {
  const query = 'SELECT * FROM postoColeta';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar posto de coleta:', err);
      return res.status(500).send('Erro ao buscar posto de coleta');
    }

    res.json(results);
  });
});

// Rota para cadastrar um produto
app.post('/produtos', (req, res) => {
  const { nome, precoPorKilo, postoColetaId } = req.body;

  const query = 'INSERT INTO produtos (nome, precoPorKilo, postoColeta_id) VALUES (?, ?, ?)';
  db.query(query, [nome, precoPorKilo, postoColetaId], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar produto:', err);
      return res.status(500).send('Erro ao cadastrar produto');
    }

    res.status(201).json({
      id: result.insertId,
      nome,
      precoPorKilo,
      postoColetaId,
    });
  });
});

// Rota para listar todos os produtos
app.get('/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).send('Erro ao buscar produtos');
    }

    res.json(results);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
