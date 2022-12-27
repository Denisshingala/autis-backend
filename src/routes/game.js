const express = require("express");
const {
  createGame,
  listGame,
  listGames,
  statistics,
} = require("../controllers/gameController");

//assign router
const router = express.Router();

router.post("/create", createGame);
router.get("/list/:gameId", listGame);
router.get("/list", listGames);
router.get("/statistics", statistics);

module.exports = router;
