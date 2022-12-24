const express = require("express");
const {
  createUserGameStatus,
  listUserGameStatus,
} = require("../controllers/userGameStatusController");

//assign router
const router = express.Router();

router.post("/create", createUserGameStatus);
router.get("/list", listUserGameStatus);

module.exports = router;
