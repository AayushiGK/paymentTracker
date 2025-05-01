const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login, signup } = require('../controller/session.controller');
const UserModel = require('../models/users');

jest.mock('../models/users'); // Mock the UserModel
jest.mock('bcrypt'); // Mock bcrypt
jest.mock('jsonwebtoken'); // Mock jwt

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/login', login);
app.post('/signup', signup);

describe('Session Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return a token and email on successful login', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
            UserModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ email: 'test@example.com', token: 'mockToken' });
            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ email: 'test@example.com' }, process.env.JWT_SECRET);
        });

        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing mandatory parameters. Please fill both Username and Password.');
        });

        it('should return 400 if user is not found', async () => {
            UserModel.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Login credentials! Please check Username and/or Password.');
        });

        it('should return 400 if password does not match', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
            UserModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrongPassword' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Login credentials! Please check Username and/or Password.');
        });

    });

    describe('signup', () => {
        it('should create a new user and return email on success', async () => {
            UserModel.findOne.mockResolvedValue(null);
            const mockUser = { email: 'test@example.com', save: jest.fn().mockResolvedValue({ email: 'test@example.com' }) };
            UserModel.mockImplementation(() => mockUser);

            const response = await request(app)
                .post('/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    firstName: 'John',
                    lastName: 'Doe',
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ email: 'test@example.com' });
            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should return 400 if mandatory fields are missing', async () => {
            const response = await request(app)
                .post('/signup')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing mandatory parameters. Please fill in all fields.');
        });

        it('should return 400 if passwords do not match', async () => {
            const response = await request(app)
                .post('/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password456',
                    firstName: 'John',
                    lastName: 'Doe',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password and Confirm Password are not the same.');
        });

        it('should return 400 if the user already exists', async () => {
            UserModel.findOne.mockResolvedValue({ email: 'test@example.com' });

            const response = await request(app)
                .post('/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                    firstName: 'John',
                    lastName: 'Doe',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username already exist.');
        });

    });
});