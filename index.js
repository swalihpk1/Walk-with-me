
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

// Express
const express = require("express");
const app = express();
const nocache = require("nocache");
const cors = require("cors");
const morgan = require('morgan');

//Morgan
const customFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(customFormat));


app.use(nocache());
app.use(cors())

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoute = require("./routes/userRoute");
app.use('/', userRoute);

app.use('/app',mapRouter);


const userRoutes = require('./routes/userRoute');
app.use('/', userRoutes)

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});
