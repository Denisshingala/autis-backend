const mongoose = require("mongoose");

const userGameStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
    gameStatus: {
      type: String,
      enum: ["Incomplete", "Complete"],
      required: true,
    },
    gameStartTime: {
      type: Date,
      required: true,
    },
    gameEndTime: {
      type: Date,
      required: true,
    },
    gameReward: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const UserGameStatus = mongoose.model("UserGameStatus", userGameStatusSchema);

module.exports = UserGameStatus;
