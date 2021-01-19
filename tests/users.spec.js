const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const dataSource = require('./examples/source.json');

const UserModel = require('../src/User/Model');

describe('User', () => {
    beforeAll(async (done) => {
        const userData = {
            "name": "Test User",
            "age": 22,
            "email":  "auth@test.com.br",
            "password": bcrypt.hashSync("1234", 10),
            "phones": "51999999999"
        }

        await UserModel.create(userData);

        const authResponse = await request(app)
            .post('/auth')
            .send({ email: dataSource.authUser.email, password: dataSource.authUser.password });

        token = authResponse.body.token;

        return done();
    });

    afterEach(async () => {
        await UserModel.deleteMany({ email: { $not: { $eq: 'auth@test.com.br' }}});
    });

    afterAll(async () => {
        await UserModel.deleteMany({});

        mongoose.connection.close();
        app.close();
    });

    it ('should be able to create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        expect(response.body).toHaveProperty('_id');
        expect(bcrypt.compareSync(dataSource.user.password, response.body.password)).toBe(true);
        expect(response.body).toMatchObject({
            "name": "Test User",
            "age": 22,
            "email":  "user@test.com.br",
            "phones": ["51999999999"]
        });
    });

    it ('should not be able to create a new user without required fields', async () => {
        await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({"age": 22, "email": "user@test.com.br", "password": "1234" })
            .expect(400);

        await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ "name": "Test User", "email": "user@test.com.br", "password": "1234" })
            .expect(400);

        await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ "name": "Test User", "age": 22, "password": "1234" })
            .expect(400);

        await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ "name": "Test User", "age": 22, "email": "user@test.com.br" })
            .expect(400);
    });

    it ('should be able to update an existent user', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        const response = await request(app)
            .put(`/users/${createResponse.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ "name": "User Updated" });

        expect(response.body).toMatchObject({
            "name": "User Updated",
            "email":  "user@test.com.br"
        });
    });

    it ('should not be able to update an user that not exists', async () => {
        await request(app)
            .put('/users/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Update User' })
            .expect(400);
    });

    it ('should be able to get an specific user', async () => {
        const createResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        const response = await request(app)
            .get(`/users/${createResponse.body._id}`)
            .set('Authorization', `Bearer ${token}`); 

        expect(response.body).toMatchObject({
            _id: createResponse.body._id,
            name: createResponse.body.name,
            age: createResponse.body.age,
            email: createResponse.body.email,
        });
    });

    it ('should be able to list the users', async () => {
        const firstUserResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        const secondUserResponse = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.body).toHaveLength(3);
        expect(response.body).toMatchObject([
            { "email": dataSource.authUser.email },
            { "_id": `${firstUserResponse.body._id}` },
            { "_id": `${secondUserResponse.body._id}` }
        ])
    });

    it ('should be able to delete an existent user', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send(dataSource.user);

        await request(app)
            .delete(`/users/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    }) 

    it ('should not be able to delete an user that not exists', async () => {
        await request(app)
            .delete('/users/123')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
    })
});