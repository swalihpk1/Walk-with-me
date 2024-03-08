
const dotenv = require("dotenv");
dotenv.config();

// Database connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Something went wrong:", error);
    });
// ----------------------------
const mapRouter = require('./routes/mapRoute');
const userRoute = require("./routes/userRoute");

// Express
const express = require("express");
const app = express();
const nocache = require("nocache");
const cors = require("cors");
const morgan = require('morgan');
const session = require('express-session')

//Morgan
const customFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(customFormat));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }));

app.use(nocache());
app.use(cors())

app.use(express.static('public'))

app.set('view engine','ejs')
app.set('views', './views/user')

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/', userRoute);

app.use('/app',mapRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000...');
});
