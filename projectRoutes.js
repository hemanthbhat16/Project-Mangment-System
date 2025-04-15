const express = require("express");
const { 
    createProject, 
    getProjects, 
    getProjectById, 
    updateProject, 
    deleteProject 
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Consistent "/projects" prefix
router.post("/projects", authMiddleware, createProject);
router.get("/projects", authMiddleware, getProjects);
router.get("/projects/:id", authMiddleware, getProjectById);
router.put("/projects/:id", authMiddleware, updateProject);
router.delete("/projects/:id", authMiddleware, deleteProject);

module.exports = router;
