
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

// Express
const express = require("express");
const app = express();
const nocache = require("nocache");
const cors = require("cors");

app.use(nocache());
app.use(cors())

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoute = require("./routes/userRoute");
app.use('/', userRoute);

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});















// const dotenv = require("dotenv");
// dotenv.config();

// // Database connection
// const mongoose = require("mongoose");
// mongoose.connect(process.env.DB_CONNECTION)
//     .then(() => {
//         console.log("Database connected");

//     })
//     .catch((error) => {
//         console.error("Something went wrong:", error);
//     });

// // Express
// const express = require("express");
// const app = express();
// const nocache = require("nocache");
// const whatsappClient = require("./services/whatsAppClient");

// whatsappClient.initialize();
// app.use(nocache());

// // Body parser
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const userRoute = require("./routes/userRoute");
// app.use('/', userRoute);

// app.listen(3000, () => {
//     console.log('Server running on port 3000...');
// });
