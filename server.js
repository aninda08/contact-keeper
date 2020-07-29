const app = require('./src/app');
const config = require('config');
const connectDB = require('./src/db/mongoose');

connectDB();

const PORT = process.env.DEV_PORT || config.get('port') || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});