const express = require("express");
const {
  createGame,
  listGame,
  listGames,
} = require("../controllers/gameController");

//assign router
const router = express.Router();

router.post("/create", createGame);
router.get("/list/:gameId", listGame);
router.get("/list", listGames);

module.exports = router;
