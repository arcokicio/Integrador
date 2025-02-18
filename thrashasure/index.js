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
  database: 'frutaria',   
});

db.connect(err => {
  if (err) {
    console.error('Erro de conexão:', err.stack);
    return;
  }
  console.log('Conectado!');
});

// Rotas

// Rota para cadastrar uma frutaria
app.post('/frutarias', (req, res) => {
  const { nome, endereco, latitude, longitude } = req.body;

  const query = 'INSERT INTO frutarias (nome, endereco, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, endereco, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar frutaria:', err);
      return res.status(500).send('Erro ao cadastrar frutaria');
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

// Rota para listar todas as frutarias
app.get('/frutarias', (req, res) => {
  const query = 'SELECT * FROM frutarias';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar frutarias:', err);
      return res.status(500).send('Erro ao buscar frutarias');
    }

    res.json(results);
  });
});

// Rota para cadastrar um produto
app.post('/produtos', (req, res) => {
  const { nome, precoPorKilo, frutariaId } = req.body;

  const query = 'INSERT INTO produtos (nome, precoPorKilo, frutaria_id) VALUES (?, ?, ?)';
  db.query(query, [nome, precoPorKilo, frutariaId], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar produto:', err);
      return res.status(500).send('Erro ao cadastrar produto');
    }

    res.status(201).json({
      id: result.insertId,
      nome,
      precoPorKilo,
      frutariaId,
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
