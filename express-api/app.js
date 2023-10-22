const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db/pool');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTA DE INSERÇÃO
app.post('/addCurriculum', (req, res) => {
    const { nome, email, telefone, formacao, profissao, experiencia } = req.body;
    const sql = 'INSERT INTO curriculos (nome, email, telefone, formacao, profissao, experiencia) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [nome, email, telefone, formacao, profissao, experiencia];

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.error('Erro ao inserir em curriculos', error);
            res.status(500).json({ message: 'Erro ao inserir na tabela' });
        } else {
            console.log('Dados inseridos com sucesso');
            res.status(200).json({ message: 'Inserção bem-sucedida!' });
        }
    });
});

// ROTA DE ATUALIZAÇÃO
app.patch('/curriculumEdit', (req, res) => {
    const { nome, email, telefone, formacao, profissao, experiencia } = req.body;
    const sql = 'UPDATE curriculos SET nome = $1, email = $2, telefone = $3, formacao = $4, profissao = $5, experiencia = $6 WHERE id = $7';
    const values = [nome, email, telefone, formacao, profissao, experiencia, req.body.id];

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.error('Erro ao atualizar em curriculos', error);
            res.status(500).json({ message: 'Erro ao atualizar na tabela' });
        } else {
            console.log('Dados atualizados com sucesso');
            res.status(200).json({ message: 'Atualização bem-sucedida!' });
        }
    });
});

// ROTA DE EXCLUSÃO
app.delete('/curriculumDelete', (req, res) => {
    const id = req.body.id;
    const sql = 'DELETE FROM curriculos WHERE id = $1';
    const values = [id];

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.error('Erro ao excluir em curriculos', error);
            res.status(500).json({ message: 'Erro ao excluir na tabela' });
        } else {
            console.log('Registro excluído com sucesso');
            res.status(200).json({ message: 'Exclusão bem-sucedida!' });
        }
    });
});

app.get('/curriculo/:id', (req, res) => {
    const curriculoId = req.params.id; // Obtém o ID da URL

    const sql = 'SELECT * FROM curriculos WHERE id = $1'; // Consulta SQL para selecionar o registro com base no ID
    pool.query(sql, [curriculoId], (error, result) => {
        if (error) {
            console.error('Erro ao buscar o currículo por ID', error);
            res.status(500).json({ message: 'Erro ao buscar o currículo por ID' });
        } else if (result.rows.length === 0) {
            res.status(404).json({ message: 'Currículo não encontrado' });
        } else {
            console.log('Currículo encontrado com sucesso');
            res.status(200).json(result.rows[0]); // Retorna o primeiro registro encontrado (deveria ser único)
        }
    });
});

// ROTA DE LISTAGEM
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM curriculos';
    pool.query(sql, (error, result) => {
        if (error) {
            console.error('Erro ao listar em curriculos', error);
            res.status(500).json({ message: 'Erro ao listar na tabela' });
        } else {
            console.log('Dados listados com sucesso');
            res.status(200).json(result.rows);
        }
    });
});





app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
