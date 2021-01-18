const express = require('express');
const router = express.Router();

const BookHandler = require('./Book/Handler');
const UserHandler = require('./User/Handler');
const AuthHandler = require('./Auth/Handler');
const BookmarkHandler = require('./Bookmark/Handler');

router.post('/auth', AuthHandler.auth);

router.post('/books', BookHandler.create);
router.get('/books', BookHandler.getAll);
router.get('/books/:id', BookHandler.getById);
router.put('/books/:id', BookHandler.update);
router.delete('/books/:id', BookHandler.delete);

router.post('/users', UserHandler.create);
router.get('/users', UserHandler.getAll);
router.get('/users/:id', UserHandler.getById);
router.put('/users/:id', UserHandler.update);
router.delete('/users/:id', UserHandler.delete);

router.post('/bookmarks', BookmarkHandler.add);
router.delete('/bookmarks', BookmarkHandler.delete);

module.exports = router;