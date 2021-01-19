const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const dataSource = require('./examples/source.json');

const BookModel = require('../src/Book/Model');
const UserModel = require('../src/User/Model');

describe('Books', () => {
    var token, user, book;

    beforeAll(async (done) => {
        const userData = {
            "name": "Test User",
            "age": 22,
            "email":  "auth@test.com.br",
            "password": bcrypt.hashSync("1234", 10),
            "phones": "51999999999"
        }

        await UserModel.findOneAndUpdate({}, userData, { upsert: true, new: true });

        const authResponse = await request(app)
            .post('/auth')
            .send({ email: dataSource.authUser.email, password: dataSource.authUser.password });

        token = authResponse.body.token;

        const bookResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        const userResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        book = bookResponse.body;
        user = userResponse.body;

        return done();
    });

    afterAll(async () => {
        await BookModel.deleteMany({});
        await UserModel.deleteMany({});

        mongoose.connection.close();
        app.close();
    });

    it('should be able to add a book on a users bookmark list', async () => {
        const response = await request(app)
            .post('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user._id, bookId: book._id });

        expect(response.body).toMatchObject({
            _id: user._id,
            bookmarks: [book]
        });
    });

    it('should not be able to add a book on an user bookmark list that does not exist', async () => {
        await request(app)
            .post('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: 123, bookId: book._id })
            .expect(400);
    });

    it('should not be able to add an nonexistent book on a users bookmark list', async () => {
        await request(app)
            .post('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user._id, bookId: 123 })
            .expect(400);
    });

    it ('should not be able to add a book twice on a users bookmark list', async () => {
        await request(app)
            .post('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user._id, bookId: book._id })
            .expect(400);
    });

    it('should be able to remove a book on a users bookmark list', async () => {
        const response = await request(app)
            .delete('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user._id, bookId: book._id });

        expect(response.body).toMatchObject({
            _id: user._id,
            bookmarks: []
        });
    });

    it('should not be able to remove an nonexistent book on a users bookmark list', async () => {
        await request(app)
            .delete('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: user._id, bookId: 123 })
            .expect(400);
    });

    it('should not be able to remove a book on an user bookmark list that does not exist', async () => {
        await request(app)
            .delete('/bookmark')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId: 123, bookId: book._id })
            .expect(400);
    });
})