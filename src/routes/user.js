const express = require("express");
const router = express.Router();
const { statistics } = require("../controllers/userController");

router.get("/statistics", statistics);

module.exports = router;
