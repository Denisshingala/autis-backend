const UserGameStatus = require("../models/userGameStatus");

const statistics = async (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    const result = await UserGameStatus.find({ userId: user._id });
    if (result) {
      return res.json({ message: "Game's Data", success: true, data: result });
    } else {
      return res.status(400).json({ error: "User not found", success: false });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error", success: false });
  }
};

module.exports = {
  statistics,
};
