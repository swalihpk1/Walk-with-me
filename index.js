const dotenv = require("dotenv");
dotenv.config();
// ----------------------------

// Database connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION, console.log("db connected")).then("mongo sussess").catch("somrthing wrong");
// ----------------------------

//expess
const express = require("express");
const app = express();
const nocache = require("nocache");


app.use(nocache());

// bodyParser
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


app.listen(3000, () => {
    console.log('Server running...')
});
