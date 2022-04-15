const express = require('express');
const router = express.Router();
const User = require('../models/User');
//Utilizando o pacote bcryptjs para fazer criptografias
const bcrypt = require('bcryptjs');
//Utilizando o pacote jsonwebtoken para criar tokens
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

//Criando token de autenticação
function generateToken(params = {}){
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}

//Rota de cadastro
router.post('/register', async (req, res) => {

    const { email } = req.body;

    try{
        //Verificando se o user já existe no banco
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        //Criando o novo user
        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id }) });

    } catch (err) {
        return res.status(400).send({ error: "Registration failed" });
    }
});

//Rota de autenticação
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if(!user)
            return res.status(400).send({ error: 'User not found' });

        //Fazendo a validação da senha do user
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password' });

        //Retirando a senha do retorno
        user.password = undefined;

        res.send({ user, token: generateToken({ id: user.id })});
    } catch (err) {
        return res.status(400).send({ error: "Authentication failed" });
    }
    
});

//Exportando as rotas deste arquivo com uma rota principal /auth
module.exports = app => app.use('/auth', router);