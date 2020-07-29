const { body } = require('express-validator');
const Contact = require('../../models/contact');

const contactValidationRules = () => {
    return [
        body('name', 'Please add name').not().isEmpty(),
        body('email', 'Please include a valid email').not().isEmpty().isEmail(),
        body('phone', 'Please include a valid phone number').isMobilePhone()
    ];
};

module.exports = {
    contactValidationRules
}