const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const dataSource = require('./examples/source.json');

const User = require('../src/User/Model');

describe('Auth', () => {
    var user = {};

    beforeAll(async (done) => {
        const userData = {
            "name": "Test User",
            "age": 22,
            "email":  "auth@test.com.br",
            "password": bcrypt.hashSync("1234", 10),
            "phones": "51999999999"
        }

        user = await User.findOneAndUpdate({}, userData, { upsert: true, new: true });

        return done();
    });

    afterAll(async () => {
        await UserModel.deleteMany({});

        mongoose.connection.close();
        app.close();
    });

    it ('should be able to authenticate an existent user', async () => {
        const response = await request(app)
            .post('/auth')
            .send({ email: dataSource.authUser.email, password: dataSource.authUser.password });

        expect(response.body).toHaveProperty('token');

        const decodedData = jwt.verify(response.body.token, process.env.AUTH_SECRET);
        
        expect(decodedData.user._id).toEqual(user._id.toString());
    });

    it ('should not be able to authenticate an user that not exists', async () => {
        await request(app)
            .post('/auth')
            .send({ email: 'notexists@test.com.br', password: '123' })
            .expect(404);
    });

    it ('should not be able to authenticate an existent user with an invalid password', async () => {
        await request(app)
            .post('/auth')
            .send({ email: dataSource.authUser.email, password: '123' })
            .expect(400);
    });

    it ('should be able to authorize an user through token', async () => {
        const authResponse = await request(app)
            .post('/auth')
            .send({ email: dataSource.authUser.email, password: dataSource.authUser.password });

        await request(app)
            .get('/')
            .set('Authorization', `Bearer ${authResponse.body.token}`)
            .expect(404);
    });

    it ('should not be able to authorize an user without token', async () => {
        await request(app)
            .get('/')
            .expect(401)
    });
});