const Game = require("../models/game");

// create game
const createGame = async (req, res) => {
  try {
    const game = new Game(req.body);
    const savedGame = await game.save();
    res.status(201).json({ success: true, data: savedGame });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false });
  }
};

// list games
const listGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ success: true, data: games });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

// list game
const listGame = async (req, res) => {
  const id = req.params.gameId;

  try {
    const game = await Game.findOne({ _id: id });
    res.status(200).json({ success: true, data: game });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false });
  }
};

module.exports = { createGame, listGame, listGames };
