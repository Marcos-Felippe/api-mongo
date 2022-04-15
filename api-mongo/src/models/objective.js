const mongoose = require('../database');

//Objectives Schema
const objectiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    //Criando a relação do objective com um reminder
    reminder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder',
        required: true,
    },
    //Criando a relação do objective um user
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'objectives' });

const Objective = mongoose.model('Objective', objectiveSchema);

module.exports = Objective;