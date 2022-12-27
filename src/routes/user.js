const express = require("express");
const router = express.Router();
import { statistics } from "../controllers/userController";

router.get("/statistics", statistics);

export default router;
