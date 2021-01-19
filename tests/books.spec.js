const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const dataSource = require('./examples/source.json');

const BookModel = require('../src/Book/Model');
const UserModel = require('../src/User/Model');

describe('Books', () => {
    var token;

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

        return done();
    });

    afterEach(async () => {
        await BookModel.deleteMany({});
    });

    afterAll(async () => {
        mongoose.connection.close();
        app.close();
    });

    it ('should be able to create a new book', async () => {
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toMatchObject(dataSource.book);
    });

    it ('should not be able to create a new book without required fields', async () => {
        await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ "isbn": "978-3-16-148410-0", "category": "Test Category", "year": 2021 })
            .expect(400);

        await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ "title": "Test Book", "category": "Test Category", "year": 2021 })
            .expect(400);

        await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ "title": "Test Book", "isbn": "978-3-16-148410-0", "year": 2021 })
            .expect(400);

        await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({ "title": "Test Book", "isbn": "978-3-16-148410-0", "category": "Test Category" })
            .expect(400);
    });

    it ('should be able to update an existent book', async () => {
        const createResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        const response = await request(app)
            .put(`/books/${createResponse.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ "title": "Test Book Updated" });

        expect(response.body).toMatchObject({
            "title": "Test Book Updated",
            "isbn": "978-3-16-148410-0",
            "category": "Test Category",
            "year": 2021
        });
    });

    it ('should not be able to update a book that not exists', async () => {
        await request(app)
            .put('/books/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Update Book' })
            .expect(400);
    });

    it ('should be able to get an specific book', async () => {
        const createResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        const response = await request(app)
            .get(`/books/${createResponse.body._id}`)
            .set('Authorization', `Bearer ${token}`); 

        expect(response.body).toMatchObject(dataSource.book);
    });

    it ('should be able to list the books', async () => {
        const firstBookResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        const secondBookResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        const response = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${token}`);

        expect(response.body).toMatchObject([firstBookResponse.body, secondBookResponse.body]);
    });

    it ('should be able to delete an existent book', async () => {
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.book);

        await request(app)
            .delete(`/books/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    }) 

    it ('should not be able to delete a book that not exists', async () => {
        await request(app)
            .delete('/books/123')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
    })
});