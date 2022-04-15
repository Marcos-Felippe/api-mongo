const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        //(selecte: false) especifica para não retornar o campo quando o documento for requisitado
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//Encriptando a senha antes de envia-la para o servidor
userSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

//Compiling our schema into a Model
const User = mongoose.model('User', userSchema);

module.exports = User;