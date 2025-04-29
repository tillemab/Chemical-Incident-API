const mongoose = require('mongoose');
const connectDatabase = require('../utils/connectDatabase');
const bcrypt = require('bcrypt');

connectDatabase();

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "You must provide an email address."]
    },
    username: {
        type: String,
        required: [true, "You must provide a username"],
        index: {unique: true}
    },
    password: {
        type: String,
        required: [true, "You must provide a password."],
        select: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        next();
    } catch {
        return next(err);
    }
});

UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch {
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema)