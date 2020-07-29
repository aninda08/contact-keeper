const express = require('express');
const userRouter = require('./routers/user');
const contactRouter = require('./routers/contact');
const path = require('path');

const app = express();

app.use(express.json({ extended: false }));

app.use('/api/users', userRouter);

app.use('/api/contacts', contactRouter);

//Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res ) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

module.exports = app;