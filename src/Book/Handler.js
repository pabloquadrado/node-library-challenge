const Book = require('./Model');

module.exports = {
    create: async (request, response) => {
        try {

            return response.status(201).json(await Book.create(request.body));

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    },

    getAll:  async (request, response) => {
        const { page = 1 } = request.query;
        const { limit = 30 } = request.query;

        const books = await Book.paginate({}, { page, limit });

        return response.json(books.docs);
    },

    getById:  async (request, response) => {
        try {

            const { id } = request.params;

            return response.json(await Book.findById(id));

        } catch (error) {
            return response.status(404).json({ error: true, message: error.message });
        }
    },

    update:  async (request, response) => {
        try {

            const { id } = request.params;
    
            return response.json(await Book.findByIdAndUpdate(id, request.body, { new: true }));
        
        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    },

    delete:  async (request, response) => {
        try {

            const { id } = request.params;

            const deleted = await Book.findByIdAndDelete(id);

            if (! deleted) {
                return response.status(400).json({ error: true, message: 'Book not found.' });
            }

            return response.status(204).send();

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    }
};