const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/users.js');

const login = (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            UserModel.findOne({ email }).then((result) => {
                if (result) {
                    bcrypt.compare(password, result.password).then((isMatch) => {
                        if (isMatch) {
                            res.json({
                                email,
                                token: jwt.sign({ email }, process.env.JWT_SECRET)
                            });
                        } else {
                            return res.status(400).json({ message: 'Invalid Login credentials! Please check Username and/or Password.' });
                        }
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid Login credentials! Please check Username and/or Password.' });
                }
            });
        } else {
            return res.status(400).json({ message: 'Missing mandatory parameters. Please fill both Username and Password.' });
        }
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
};

const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing mandatory parameters. Please fill in all fields.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password and Confirm Password are not the same.' });
        }

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exist.' });
        }

        const userObj = new UserModel({ email, password, firstName, lastName, role: 'user' });
        const savedObj = await userObj.save();

        res.status(200).json({ email: savedObj.email });
    } catch (err) {
        return res.status(500).json({ err, message: 'Uh Oh! Something went wrong. Please try again in sometime.' });
    }
};

module.exports = {
    login,
    signup
};