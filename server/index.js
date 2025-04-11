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

// implement a method to refresh jwt token
// server.post('/api/refresh', (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//        return res.status(401).json({ message: 'Unauthorized' });
//       }
//       const newToken = jwt.sign({ username: decoded.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ token: newToken });
//     });
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// implement a method to logout and invalidate the jwt token
// server.post('/api/logout', (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       // invalidate the token by adding it to a blacklist
//       // this can be done by storing the token in a database or in memory
//       // and checking if the token is in the blacklist on each request
//       // for simplicity, we will just return a success message
//       return res.json({ message: 'Logged out successfully' });
//     });
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// implement a method to check if the jwt token is valid
// server.get('/api/check', (req, res) => {
//   const token = req.headers['authorization'];
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       return res.json({ message: 'Token is valid' });
//     });
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// implement a jwt based authentication middleware
// server.use((req, res, next) => {
//   const token = req.headers['authorization'];
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       req.user = decoded;
//       next();
//     });
//   } else {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// });

// server.use((req, res, next) => {
//     const auth = req.headers['authorization'];
//     if (auth) {
//         const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
//         if (username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD) {
//             next();
//         } else {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//     } else {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// });

server.use('/api', apiRouter);

server.get('*splat', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected!');
    server.listen(process.env.NODE_PORT, () => console.log(`App running on ${process.env.NODE_PORT}`));
}).catch((err) => console.error('MongoDB connection error:', err));
