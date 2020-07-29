const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET = process.env.JWT_SECRET || config.get('jwtsecret');
const Contact = require('./contact');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    age: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('contacts', {
    ref: 'Contact',
    localField: '_id',
    foreignField: 'user'
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    
    await user.save();

    return token;
};

userSchema.statics.findUserByEmail = async (email) => await User.findOne({ email });

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.pre('save', async function(next) {
    const user = this;
    const salt = await bcrypt.genSalt();

    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, salt);

    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;

    await Contact.deleteMany({ user: user._id});

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;