const User = require('./Model');

const bcrypt = require('bcrypt');

module.exports = {
    create: async (request, response) => {
        try {
            
            const user = request.body;

            user.password = bcrypt.hashSync(user.password, 10);

            return response.status(201).json(await User.create(user));

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }    
    },

    getAll:  async (request, response) => {
        const { page = 1 } = request.query;
        const { limit = 30 } = request.query;

        const users = await User.paginate({}, { page, limit, populate: 'bookmarks' });

        return response.json(users.docs);
    },

    getById:  async (request, response) => {
        try {

            const { id } = request.params;

            return response.json(await User.findById(id).populate('bookmarks'));

        } catch (error) {
            return response.status(404).json({ error: true, message: error.message });
        }
    },

    update:  async (request, response) => {
        try {

            const { id } = request.params;
    
            const user = await User.findByIdAndUpdate(id, request.body, { 
                new: true, 
                populate: 'bookmarks' 
            });

            return response.json(user);
        
        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    },

    delete:  async (request, response) => {
        try {

            const { id } = request.params;

            const deleted = await User.findByIdAndDelete(id);

            if (! deleted) {
                return response.status(400).json({ error: true, message: 'User not found.' });
            }

            return response.status(204).send();

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    }
};