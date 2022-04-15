require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.URI;

main().catch(err => console.log(err));

async function main() {
    //Criando a conexão com o banco
    await mongoose.connect(uri);
}

module.exports = mongoose;