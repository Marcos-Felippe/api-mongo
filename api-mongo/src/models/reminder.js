const mongoose = require('../database');

//Reminder Schema
const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //Criando a relação do reminder com um user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    //Criando a relação do reminder com muitos objectives
    objectives: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Objective',
    }],
    time: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'reminders' });

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;