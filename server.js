const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const port = 3000;
const app = express();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(cors({
    origin: '*', 
}));


async function connectToMongo() {
    try {
        await mongoClient.connect();
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}

app.post('/register', async (req, res) => {
    console.log("Requisição POST recebida"); // Verifica se a requisição chega
    const { username, password, discordid, key } = req.body;
    if (!username || !password || !discordid || !key) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const db = mongoClient.db('Cluster0');
        const userCollection = db.collection('reaper');
        const keyCollection = db.collection('keys');
        console.log("Processando registro do usuário...");

        // Verifica se a chave é válida
        const keyEntry = await keyCollection.findOne({ key: key });
        if (!keyEntry) {
            return res.status(400).json({ success: false, message: 'Chave inválida.' });
        }

        // Verifica se o usuário já existe
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Usuário já existe.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo usuário com todos os dados
        const newUser = {
            username,
            password: hashedPassword,
            discordid,
            key: keyEntry.key,  // Vincula a chave ao usuário
            createdAt: new Date(),
        };

        // Insere o novo usuário na coleção
        await userCollection.insertOne(newUser);

        console.log("Usuário registrado com sucesso!");

        return res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});



// Rota para login de um usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Nome de usuário e senha são necessários.' });
    }

    try {
        const db = mongoClient.db('Cluster0');
        const userCollection = db.collection('users');

        const user = await userCollection.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        // Compara a senha fornecida com a senha criptografada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Senha incorreta.' });
        }

        // Gera um token JWT
        const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido!',
            token: token,  // Retorna o token JWT
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
});

// Iniciar o servidor
    app.listen(3000, () => {
        console.log('Servidor ouvindo na porta 3000');
    connectToMongo();
});
