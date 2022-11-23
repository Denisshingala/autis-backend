const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Connection with Database
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Successfully connect with mongodb...")
}).catch((err) => { console.log(err) });