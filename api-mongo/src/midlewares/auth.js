const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

//Utilizando um midleware para interceptar as requisições que necessitam de autenticação por token
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided' });
    
    //Separando o token em 2 partes
    const parts = authHeader.split(' ');

    if(!parts.lenght === 2)
        return res.status(401).send({ error: 'Invalid token lenght' });

    const [ scheme, token ] = parts;

    //Verificando se o token possui o conteúdo esperado
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Invalid token formatting' });
    
    //Verificando se o token é valido pela nossa aplicação
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({ error: 'Invalid Token' });

        //Retornando o id para a aplicação
        req.userId = decoded.id;
        return next();
    });
};