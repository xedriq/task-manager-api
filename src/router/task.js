const express = require('express')
const auth = require('../middleware/auth')

// Create router
const router = new express.Router()

// Load task model
const Task = require('../models/task')


// POST /tasks
// @desc  Create task authored by current user
// @access Private
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// GET /tasks
// @url query string: completed=true, limit=2, skip=2, sortBy=createdAt_desc
// @desc  Fetch all tasks of current user
// @access Private
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ author: req.user._id }) // this also works
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split('_')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // console.log(task)
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send()
    }
})

// GET /tasks/:id
// @desc  Fetch task or current user by id
// @access Private
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(500).send()
    }
})

// PATCH /tasks/:id
// @desc Update task by id
// @access Private
router.patch('/tasks/:id', auth, async (req, res) => {

    // Check for invalid fields.
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValidFields = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidFields) {
        return res.status(400).send({ error: 'You are trying to update an invalid field/s' })
    }

    try {

        // Find task to update
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })
        // const task = await Task.findById(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        // Loop througn the fields the user is trying to update
        updates.forEach(update => task[update] = req.body[update])

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error.message)
    }

})

// DELETE /tasks/:id
// @desc Detele a task by current user by id
// @access Private
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'No task with that id' })
        }
        res.send(task)
    } catch (error) {
        return res.status(500).send()
    }

})

module.exports = router