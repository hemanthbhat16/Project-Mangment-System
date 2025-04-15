const { Project } = require("../models");

exports.createProject = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const { project_name, description, start_date, end_date, status} = req.body;
        if(!project_name || !description)
        {
            return res.status(400).json({ message: "Project name and description are required" });
        }

        const created_by = req.user.userId;
        const userId = req.user.userId;
        if(!created_by){
            return res.status(400).json({ message: "User name is required" });
        }
        const project = await Project.create({ project_name, description, start_date, end_date, status, userId, created_by});
        res.status(201).json({ message: "Project created successfully", project });
    }
    catch(error)
    {
        res.status(500).json({ message: "Error creating Project", error: error.message });
    }
};

exports.getProjects = async(req, res) => {
    try{
        const projects = await Project.findAll({ where: {userId: req.user.userId} });
        res.status(200).json(projects);
    }
    catch(error)
    {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
};

exports.getProjectById = async(req, res) => {
    try{
        const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.userId } });
        if(!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    }
    catch(error)
    {
        res.status(500).json({ message: "Error fetching prject", error: error.message });
    }
};

exports.updateProject = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const { project_name, description } = req.body;
        const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.userId} });

        if(!project){
            return res.status(404).json({ message: "Project not found" });
        }

        await project.update({ project_name, description });
        res.status(200).json({ message: "Project updated successfully", project });
    }
    catch(error)
    {
        res.status(500).json({ message: "Error updating project", error: error.message });
    }
};

exports.deleteProject = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const project = await Project.findOne({ where: { id: req.params.id, userId: req.user.userId } });
        if(!project)
        {
            return res.status(404).json({ message: "Project not found" });
        }
        await project.destroy();
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "Error deleting project", error: error.message });
    }
};