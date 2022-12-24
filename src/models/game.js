const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    details: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: true,
    },
    introVideoLink: {
        type: String,
        required: false
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;