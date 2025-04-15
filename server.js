require("dotenv").config({ path: "C:/Users/hp/OneDrive/Desktop/Project Management System/backend/.env" });
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// console.log("DB_DIALECT:", process.env.DB_DIALECT);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_HOST:", process.env.DB_HOST);

const express = require("express");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

db.sequelize.sync().then(() => {
    console.log("Database connected!");
}).catch((err) => {
    console.error("Error connecting to the database:",err);
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

