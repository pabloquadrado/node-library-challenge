const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes');
const database = require('./Database/Connection');
const authHandler = require('./Auth/Handler');

const app = express();

app.use(authHandler.checkAccess);

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

database.connect();

app.use(cors());
app.use(express.json());
app.use(router);

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 3333, () => {
        console.log('Server is running');
    });
}

module.exports = app;