// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     logging: false,
// });

// module.exports = sequelize;

require("dotenv").config({ path: "C:/Users/hp/OneDrive/Desktop/Project Management System/backend/.env" });
const { Sequelize } = require("sequelize");

// Debugging: Check if environment variables are loaded
console.log("DB_DIALECT:", process.env.DB_DIALECT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql", // Ensure dialect is explicitly supplied
        logging: false // Optional: Logs SQL queries for debugging
    }
);

module.exports = sequelize;
