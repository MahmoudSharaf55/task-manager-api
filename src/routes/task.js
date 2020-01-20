const express = require('express');
const Task = require("../models/task");
const auth = require('../middleware/auth');

const router = new express.Router();
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,        // copy of objects in body
        owner: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/tasks', auth, async (req, res) => {
    // const match = {};
    // if (req.query.completed){
    //     match.completed = req.query.completed === 'true'
    // }
    const sort = {};
    if (req.query.sort){
        const parts = req.query.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        let tasks;
        if (req.query.completed){
            tasks = await Task.find({owner: req.user._id}).where({completed: req.query.completed})
                .limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort);   // append .limit(1).skip(1)
        } else {
            tasks = await Task.find({owner: req.user._id})
                .limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort);   // append .limit(1).skip(1)
        }
        res.send(tasks);
        // another option for getting user tasks from virtual variable in user model
        // await req.user.populate({
        //      path: 'tasks',
        //      match: {
        //          completed: true,    // filtering
        //          options:{
        //              limit: 1,
        //              skip: 1,
        //              sort: {
        //                  createdAt: -1,
        //              }
        //          }
        //      }
        // }).execPopulate();
        // res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send({error: 'you are not authenticated'})
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updateKeys = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updateKeys.every(item => allowedUpdates.includes(item));
    if (!isValid) {
        return res.status(404).send({error: 'Invalid Args'})
    }
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({error: 'you are not authorized'})
        }
        updateKeys.forEach(item => task[item] = req.body[item])
        await task.save()
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({error: 'you are not authorized'})
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;