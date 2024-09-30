const PORT = 8000;
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'seu_segredo_aqui';

// Banco de dados SQLite3
const dbPath = path.resolve(__dirname, 'app-data.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        nome TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        endereco TEXT,
        numero INTEGER,
        cidade TEXT,
        estado TEXT,
        pais TEXT,
        telefone TEXT,
        about TEXT,
        matches TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS empresas (
        empresa_id TEXT PRIMARY KEY,
        cnpj TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        nome_empresa TEXT NOT NULL,
        endereco_empresa TEXT,
        telefone_empresa TEXT,
        about_empresa TEXT,
        matches TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
        message_id TEXT PRIMARY KEY,
        from_userid TEXT NOT NULL,
        to_userid TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_userid) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (to_userid) REFERENCES users(user_id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        job_id TEXT PRIMARY KEY,
        empresa_id TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        requisitos TEXT,
        salario TEXT,
        FOREIGN KEY (empresa_id) REFERENCES empresas(empresa_id)
    )`);
    
 
    
});

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token é necessário');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }

        console.log('Decoded Token:', decoded); // Adicione esta linha
        req.user = decoded;
        next();
    });
};

// Rotas

// Cadastro de usuário
app.post('/signup', async (req, res) => {
    const { email, password, nome, cpf } = req.body;

    if (!email || !password || !nome || !cpf) {
        return res.status(400).send('Email, senha, nome e CPF são obrigatórios');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    db.run(`INSERT INTO users (user_id, email, hashed_password, nome, cpf) VALUES (?, ?, ?, ?, ?)`,
        [userId, email, hashedPassword, nome, cpf],
        function (err) {
            if (err) {
                return res.status(400).send('Erro ao cadastrar usuário: ' + err.message);
            }
            const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1d' });
            res.status(201).json({ token, userId });
        }
    );
});

// Login de usuário
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno no servidor: ' + err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.hashed_password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Login bem-sucedido',
                token: token,
                userId: user.user_id,
                email: user.email,
                nome: user.nome
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao verificar a senha: ' + error.message });
        }
    });
});

app.get('/candidato', verifyToken, (req, res) => {
    const userId = req.user.userId; // Agora deve pegar o userId corretamente

    db.get(`SELECT user_id, email, nome, cpf, endereco, numero, cidade, estado, pais, telefone, about, matches FROM users WHERE user_id = ?`, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(row);
    });
});


// Cadastro de empresa
app.post('/signup-empresa', async (req, res) => {
    const { cnpj, password, nome_empresa, endereco_empresa, telefone_empresa, about_empresa } = req.body;

    if (!cnpj || !password || !nome_empresa || !endereco_empresa || !telefone_empresa || !about_empresa) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const empresaId = uuidv4();

    db.run(`INSERT INTO empresas (empresa_id, cnpj, hashed_password, nome_empresa, endereco_empresa, telefone_empresa, about_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [empresaId, cnpj, hashedPassword, nome_empresa, endereco_empresa, telefone_empresa, about_empresa],
        function (err) {
            if (err) {
                return res.status(400).send('Erro ao cadastrar empresa: ' + err.message);
            }
            const token = jwt.sign({ empresaId: empresaId }, JWT_SECRET, { expiresIn: '1d' });
            res.status(201).json({ token, empresaId });
        }
    );
});

// Login de empresa
app.post('/login-empresa', async (req, res) => {
    const { cnpj, password } = req.body;

    if (!cnpj || !password) {
        return res.status(400).send('CNPJ e senha são obrigatórios');
    }

    db.get('SELECT * FROM empresas WHERE cnpj = ?', [cnpj], async (err, empresa) => {
        if (err || !empresa) {
            return res.status(404).send('Empresa não encontrada');
        }

        const isPasswordValid = await bcrypt.compare(password, empresa.hashed_password);

        if (!isPasswordValid) {
            return res.status(401).send('Senha inválida');
        }

        // Verifica se o cadastro da empresa está completo
        const cadastroCompleto = empresa.nome_empresa && empresa.endereco_empresa && empresa.telefone_empresa && empresa.about_empresa;

        const token = jwt.sign({ empresaId: empresa.empresa_id }, JWT_SECRET, { expiresIn: '1d' });

        // Retorna o token e o estado do cadastro
        res.status(200).json({ token, empresaId: empresa.empresa_id, cadastroCompleto });
    });
});


// Obter dados de um usuário autenticado
app.get('/user', verifyToken, (req, res) => {
    const userId = req.user.userId;
    console.log('Requesting user data for userId:', userId);

    db.get(`SELECT user_id, email, nome, cpf, endereco, numero, cidade, estado, pais, telefone, about, matches FROM users WHERE user_id = ?`, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log('User data retrieved:', row); // Adicione esta linha
        if (!row) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(row);
    });
});

// Atualizar dados do candidato
// Atualizar dados do candidato
// Atualizar dados do candidato
app.put('/candidato', verifyToken, (req, res) => {
    const userId = req.user.userId;
    const { endereco, numero, cidade, estado, pais, telefone, about } = req.body;

    db.run(`UPDATE users SET endereco = ?, numero = ?, cidade = ?, estado = ?, pais = ?, telefone = ?, about = ? WHERE user_id = ?`,
        [endereco, numero, cidade, estado, pais, telefone, about, userId],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao atualizar usuário: ' + err.message });
            }
            res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
        }
    );
});







// Obter dados de uma empresa autenticada
app.get('/empresa', verifyToken, (req, res) => {
    const empresaId = req.user.empresaId;

    db.get(`SELECT * FROM empresas WHERE empresa_id = ?`, [empresaId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        res.json(row);
    });
});

// Enviar mensagem
app.post('/messages', verifyToken, (req, res) => {
    const { to_userid, message } = req.body;
    const from_userid = req.user.userId;
    const messageId = uuidv4();

    if (!to_userid || !message) {
        return res.status(400).send('Para e mensagem são obrigatórios.');
    }

    db.run(`INSERT INTO messages (message_id, from_userid, to_userid, message) VALUES (?, ?, ?, ?)`,
        [messageId, from_userid, to_userid, message],
        function (err) {
            if (err) {
                return res.status(400).send('Erro ao enviar mensagem: ' + err.message);
            }
            res.status(201).json({ messageId, from_userid, to_userid, message });
        }
    );
});

// Obter mensagens entre usuários
app.get('/messages/:userid', verifyToken, (req, res) => {
    const userId = req.params.userid;
    const currentUserId = req.user.userId;

    db.all(`SELECT * FROM messages WHERE (from_userid = ? AND to_userid = ?) OR (from_userid = ? AND to_userid = ?)`,
        [currentUserId, userId, userId, currentUserId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// Obter todos os usuários
app.get('/users', verifyToken, (req, res) => {
    db.all(`SELECT user_id, email, nome FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Obter todas as empresas
app.get('/empresas', verifyToken, (req, res) => {
    db.all(`SELECT empresa_id, cnpj, nome_empresa FROM empresas`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Atualizar dados da empresa
app.put('/update-empresa', verifyToken, (req, res) => {
    const empresaId = req.user.empresaId; // Verifique se está recuperando o ID corretamente do token
    const { endereco_empresa, telefone_empresa, about_empresa } = req.body;

    db.run(`UPDATE empresas SET endereco_empresa = ?, telefone_empresa = ?, about_empresa = ? WHERE empresa_id = ?`,
        [endereco_empresa, telefone_empresa, about_empresa, empresaId],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao atualizar empresa: ' + err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Empresa não encontrada.' });
            }
            res.status(200).json({ message: 'Empresa atualizada com sucesso.' });
        }
    );
});




// Rota para listar todas as vagas de emprego
app.get('/jobs', verifyToken, (req, res) => {
    const query = `
        SELECT jobs.job_id, jobs.titulo, jobs.descricao, jobs.requisitos, jobs.salario, empresas.nome_empresa 
        FROM jobs 
        JOIN empresas ON jobs.empresa_id = empresas.empresa_id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Iniciar o servidor
app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
