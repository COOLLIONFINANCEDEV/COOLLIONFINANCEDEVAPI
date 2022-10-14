require('dotenv').config();
const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log(`Successfully connected to the database ${process.env.DB_NAME}.`);
});

module.exports = connection;