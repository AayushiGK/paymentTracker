const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    role: { type: String, required: true }
});

usersSchema.pre('save', function (next) {
    if (this.password) {
        bcrypt.hash(this.password, 10).then((hashedPassword) => {
            this.password = hashedPassword;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('users', usersSchema);