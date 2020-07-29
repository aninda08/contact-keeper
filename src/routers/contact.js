const express = require('express');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { contactValidationRules } = require('../middleware/validationRules/contactValidationRules.js');

const User = require('../models/user');
const Contact = require('../models/contact');

const router = new express.Router();

//get all contact for the user
//GET /?type=personal --> filters data
//GET /?limit=10&skip=10 --> pagination
//GET /?sortBy=createdAt:desc --> sort the result
router.get('/', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.type) {
        match.type = req.query.type;
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'contacts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.contacts);
    } catch (e) {
        res.status(500).send(e);
    }
});

//get contact with id
router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const contact = await Contact.findOne({ _id, user: req.user._id});
        
        if(!contact)
            return res.status(404).send();
        res.send(contact);
    } catch (e) {
        res.status(500).send(e);
    }
});

//add new contact for the user
router.post('/', auth, contactValidationRules(), validate, async (req, res) => {
    const newContact = new Contact({
        ...req.body,
        user: req.user.id
    });
    try {
        const contact = await newContact.save();
        res.send(contact);
    } catch (e) {
        res.status(500).send(e);
    }
});

//update contact for the user
router.patch('/:id', auth, async (req, res) => {
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    // const allowedUpdates = ['name', 'email', 'phone', 'type'];
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    // if(!isValidOperation)
    //     return res.status(404).send({error: 'Invalid Updates!'});
    try {
        const contact = await Contact.findOne({ _id, user: req.user._id});

        if(!contact)
            return res.status(404).json({msg: 'Contact not found'});
        
        updates.forEach((update) => contact[update] = req.body[update]);
        await contact.save();

        res.send(contact);
    } catch (e) {
        res.status(500).send(e);
    }
});

//delete contact for the user
router.delete('/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if(!contact)
            return res.status(404).send();

        res.send(contact);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;