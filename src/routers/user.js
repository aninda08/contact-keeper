const express = require('express');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { userValidationRules } = require('../middleware/validationRules/userValidationRules');
const User = require('../models/user');

const router = new express.Router();

//Register users
router.post('/', userValidationRules(), validate, async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
});

//Login Users
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
});

//Logout user session
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

//Logout all user session
router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

//View profile
router.get('/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

//View others profile
router.get('/:id', auth, async (req, res) => {
    try {
        res.send({result: "Profile info for user with the id"});
    } catch (e) {
        res.status(500).send(e);
    }
});

//Update profile
router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation)
        return res.status(404).send({error: 'Invalid Updates!'});

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Delete profile
router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;