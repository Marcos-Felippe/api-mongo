const express = require('express');
const router = express.Router();
const authMidleware = require('../midlewares/auth');
const User = require('../models/User');
const Reminder = require('../models/Reminder');
const Objective = require('../models/Objective');


//Passando a requisição para o midleware
router.use(authMidleware);

//Rota de pesquisa
router.get('/', async (req, res) => {
    try {
        const reminders = await Reminder.find().populate(['user', 'objectives']);

        return res.send({ reminders });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading reminders' });
    }
});

//Rota de pesquisa por id
router.get('/:reminderId', async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.reminderId).populate(['user', 'objectives']);

        return res.send({ reminder });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error loading reminder' });
    }
});

//Rota de create
router.post('/', async (req, res) => {
    try {
        const { title, description, objectives } = req.body;
        const reminder = await Reminder.create({ title, description, user: req.userId });

        await Promise.all(objectives.map( async objective => {
            const reminderObjective = new Objective({ ...objective, reminder: reminder._id });

            await reminderObjective.save();
            reminder.objectives.push(reminderObjective);
        }));

        await reminder.save();

        return res.send({ reminder });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating reminder' });
    }
});

//Rota de update
router.put('/:reminderId', async (req, res) => {
    try {
        const { title, description, objectives } = req.body;
        const reminder = await Reminder.findByIdAndUpdate(req.params.reminderId, {
            title,
            description,
        }, {new: true});

        reminder.objectives = [];
        await Objective.deleteOne({ reminder: reminder._id });

        await Promise.all(objectives.map( async objective => {
            const reminderObjective = new Objective({ ...objective, reminder: reminder._id });

            await reminderObjective.save();
            reminder.objectives.push(reminderObjective);
        }));

        await reminder.save();

        return res.send({ reminder });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error editing reminder' });
    }
});

//Rota de delete
router.delete('/:reminderId', async (req, res) => {
    try {
        await Reminder.findByIdAndRemove(req.params.reminderId);

        return res.send({ success: 'Reminder deleted' });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error deleting reminder' });
    }
});


module.exports = app => app.use('/reminders', router);