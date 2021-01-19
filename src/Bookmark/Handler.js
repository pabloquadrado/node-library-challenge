const Book = require('../Book/Model');
const User = require('../User/Model');

module.exports = {
    add: async (request, response) => {
        try {

            const { userId, bookId } = request.body;

            const book = await Book.findById(bookId);
            
            const user = await User.findById(userId).populate('bookmarks');

            const bookExist = user.bookmarks.find(book => book._id == bookId);

            if (bookExist) {
                return response.status(400).json({ error: true, message: 'Book already bookmarked for this user.'});
            }

            user.bookmarks.push(book);

            await User.updateOne({ _id: userId }, user);

            return response.json(user);

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    },

    delete: async (request, response) => {
        try {

            const { userId, bookId } = request.body;

            const user = await User.findById(userId).populate('bookmarks');
            
            const bookExist = user.bookmarks.find(book => book._id == bookId);
            
            if (!bookExist) {
                return response.status(400).json({ error: true, message: 'Book is not on user bookmark list.'});
            }

            user.bookmarks.pull({ _id: bookId });

            await User.updateOne({ _id: userId }, user);

            return response.json(user);

        } catch (error) {
            return response.status(400).json({ error: true, message: error.message });
        }
    }
};