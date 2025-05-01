require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const apiRouter = require('./apiRouter');

const server = express();

server.use(express.json());
server.use(cors());

server.use(express.static(path.join(__dirname, '..', 'dist')));

server.use('/api', apiRouter);

server.get('*splat', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected!');
    server.listen(process.env.NODE_PORT, () => console.log(`App running on ${process.env.NODE_PORT}`));
}).catch((err) => console.error('MongoDB connection error:', err));
