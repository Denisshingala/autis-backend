const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const authenticationRoute = require("./routes/authentication");
const gameRoute = require("./routes/game");
const userGameStatusRoute = require("./routes/userGameStatus");
const { authenticateToken } = require("./controllers/authController");

require("./config/dbConn");

//assign port number
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hi");
});

dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", authenticationRoute);
app.use("/game", authenticateToken, gameRoute);
app.use("/userGameStatus", authenticateToken, userGameStatusRoute);

app.listen(PORT, () => {
  console.log("Server is ready to run...");
});
