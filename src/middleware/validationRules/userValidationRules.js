const { body } = require('express-validator');
const User = require('../../models/user');

const userValidationRules = () => {
    return [
        body('name', 'Please add name').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail().custom(async (value) => {
            const user = await User.findUserByEmail(value);
            if(user)
                throw new Error('Email already is use');
            return true;
        }),
        body('age', 'Please include a valid age').custom( value => {
            if(value < 0)
                throw new Error();
             return true;
        }),
        body('password', 'Please enter a password with 6 or more characters').isLength({ min:6 })
    ];
};

module.exports = {
    userValidationRules
}