const { Task, Project, User } = require("../models");

exports.createTask = async(req, res) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const {task_name, status, priority, due_date, project_name, assigned_to} = req.body;

        if(!task_name || !project_name || !assigned_to || !due_date)
        {
            return res.status(400).json({ message: "Task name, project Name, due_date and assigned user are required" });
        }

        const project = await Project.findOne({ where: {project_name} });
        if(!project) return res.status(404).json({ message: "Project not found" });

        const user = await User.findByPk(assigned_to);
        if(!user) return res.status(404).json({ message: "Assigned user not found "});

        const newTask = await Task.create({ 
            task_name,
            status: status || "Pending", 
            priority: priority || "Medium",
            due_date,
            assigned_to: user.id,
            project_id: project.id,
        });
        res.status(201).json({ message: "Task created successfully", newTask });
    }
    catch(error)
    {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            attributes: ["id", "task_name", "status", "priority", "due_date", "assigned_to", "project_id"],
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};


exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id },
            attributes: ["id", "task_name", "status", "priority", "due_date", "assigned_to", "project_id"],
        });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching task", error: error.message });
    }
};


exports.updateTask = async (req, res) => {
    try {
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const { task_name, status, priority, due_date, assigned_to, project_id } = req.body;
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        let project = null;
        if (project_id) {
            project = await Project.findByPk(project_id);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
        }

        await task.update({
            attributes: ["id", "task_name", "status", "priority", "due_date", "assigned_to", "project_id"],
            task_name: task_name || task.task_name,
            status: status || task.status,
            priority: priority || task.priority,
            due_date: due_date || task.due_date,
            assigned_to: assigned_to || task.assigned_to,
            project_id: project ? project.id : task.project_id
        });

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        if(req.user.role !== "Admin") {
            return res.status(403).json({ message: "Only admins can create Projects" });
        }
        const task = await Task.findOne({ 
            where: { id: req.params.id }, 
            attributes: ["id", "task_name", "status", "priority", "due_date", "assigned_to", "project_id"]});
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.destroy();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};
