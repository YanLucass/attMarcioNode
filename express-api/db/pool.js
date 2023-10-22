const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = 3000; 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.connect((error, client) => {
  if (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
  } else {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS curriculos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        formacao VARCHAR(255) NOT NULL,
        profissao VARCHAR(255) NOT NULL,
        experiencia VARCHAR(255)
    );
    `;

    client.query(createTableQuery, (error, result) => {
      if (error) {
        console.error('Erro ao criar a tabela "curriculos":', error);
      } else {
        console.log('Tabela "curriculos" criada com sucesso.');
      }
      client.release();
    });
  }
});

module.exports = pool;
