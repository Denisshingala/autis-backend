const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 8
    },
    DOB: Date,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;