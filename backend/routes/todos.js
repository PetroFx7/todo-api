const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

//CREATE
router.post('/', async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json(todo)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});
//READ
router.get('/', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});
//DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({message: 'Deleted'});
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updated = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

module.exports = router;