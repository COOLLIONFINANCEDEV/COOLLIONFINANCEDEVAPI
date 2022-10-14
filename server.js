require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
// const test = require('./test_middleware.js');

const userRoute = require("./routes/userRoute");
const loanRoute = require("./routes/loanRoute");

const APP = express();
const CORS_OPTION = process.env.CORS_OPTION || {}
const PORT = process.env.PORT || 8001;

APP.use(cors(CORS_OPTION));
APP.use(bodyParser.urlencoded({ extended: true })); // parse requests body on json format
APP.use(express.json()); // parse requests of content-type - application/json
APP.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// APP.use(test);
APP.use('/api/user/', userRoute);
APP.use('/api/loan/', loanRoute);

APP.listen(PORT, () => {
    console.log(`Server started : http://127.0.0.1:${PORT}`);
})