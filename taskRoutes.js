const express = require("express");
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/tasks", authMiddleware, createTask);
router.get("/tasks", authMiddleware, getTasks);
router.get("/tasks/:id", authMiddleware, getTaskById);
router.put("/tasks/:id", authMiddleware, updateTask);
router.delete("/tasks/:id", authMiddleware, deleteTask);

module.exports = router;