const UserGameStatus = require("../models/userGameStatus");
const ObjectId = require("mongoose").Types.ObjectId;

// create user game status
const createUserGameStatus = async (req, res) => {
  try {
    const userGameStatus = new UserGameStatus(req.body);
    const savedUserGameStatus = await userGameStatus.save();
    res.status(201).json({ success: true, data: savedUserGameStatus });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false });
  }
};

// list user game status
const listUserGameStatus = async (req, res) => {
  const { userId, gameId } = req.body;

  if (!userId || !gameId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing fields: game id and user id" });
  }

  try {
    const userGameStatus = await UserGameStatus.find({
      userId: ObjectId(userId),
      gameId: ObjectId(gameId),
    });
    res.status(200).json({ success: true, data: userGameStatus });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false });
  }
};

module.exports = { createUserGameStatus, listUserGameStatus };
