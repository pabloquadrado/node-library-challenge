const User = require('../User/Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    auth: async (request, response) => {
        const { email, password } = request.body;

        const user = await User.findOne({ email });

        if (!bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({ error: true, message: 'Invalid password.' });
        }

        response.json({ 
            token: jwt.sign({ user }, process.env.AUTH_SECRET)
        });
    },

    checkAccess: async (request, response, next) => {
        if (request.url === '/auth') {
            return next();
        }

        // if (!request.headers.authorization) {
        //     return response.status(401).send();
        // }

        // const token = request.headers.authorization.split(' ')[1];

        // try {

        //     jwt.verify(token, process.env.AUTH_SECRET);
        
        // } catch (error) {
        //     return response.status(401).send();
        // }

        return next();
    }
};