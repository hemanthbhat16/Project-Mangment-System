const sequelize = require("../config/db");
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");

User.hasMany(Project, { foreignKey: "userId" , onDelete: "CASCADE"});
Project.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Task, { foreignKey: "assignedTo", onDelete: "SET NULL" });
Task.belongsTo(User, { foreignKey: "assignedTo" });

User.hasMany(Task, { foreignKey: "projctId", onDelete: "CASCADE"})
Task.belongsTo(Project, { foreignKey: "projectId" })

const db = { sequelize, User, Project, Task };
module.exports = db;