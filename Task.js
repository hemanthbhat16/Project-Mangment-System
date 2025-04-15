const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Project");
const User = require("./User");

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Pending", "In Progress", "Completed"), defaultValue: "Pending"
    },
    priority: {
        type: DataTypes.ENUM("Low", "Medium", "High"), defaultValue: "Medium"
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    project_id: {
        type: DataTypes.STRING, 
        allowNull: false,
        references: {
            model: "projects",
            key: "id"
        }
    }
}, {
    timestamps: true
});

module.exports = Task;