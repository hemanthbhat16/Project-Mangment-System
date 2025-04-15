import React, { useState, useEffect } from "react";
import axios from "axios";
import "../projectManagement.css"

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ 
        project_name: "", 
        description: "", 
        start_date: "", 
        end_date: ""
        // created_by: ""
    });

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        // const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
        // setProjects(storedProjects);
        if(!user) return;

        axios.get("http://localhost:8080/api/project/project", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setProjects(res.data);
        })
        .catch(err => {
            console.error("Error fetching projects:", err);
        });
    }, [user, token]);

    const handleAddProject = () => {
        // if (newProject.project_name && newProject.description && newProject.start_date && newProject.end_date) {
        //     const newProjectData = {
        //         project_id: projects.length + 1, // Auto-increment project ID
        //         ...newProject,
        //     };

        //     const updatedProjects = [...projects, newProjectData];
        //     setProjects(updatedProjects);

        //     localStorage.setItem("projects", JSON.stringify(updatedProjects));

        //     console.log("New Project Added:", newProjectData);
        //     console.log("Updated Project List:", updatedProjects);

        //     setNewProject({ project_name: "", description: "", start_date: "", end_date: "", created_by: "Admin" });
        // } else {
        //     alert("Please fill all fields!");
        // }
        if(!newProject.project_name || !newProject.description || !newProject.start_date, !newProject.end_date) {
            alert("Please fill all fields!");
            return;
        }

        const requestBody = {
            projectName: newProject.project_name,
            description: newProject.description,
            startDate: newProject.start_date,
            endDate: newProject.end_date,
            id: user.id
        };

        axios.post("http://localhost:8080/api/project/create", requestBody, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
        .then(res => {
            setProjects(prev => [...prev, res.data]);
            alert("Project Added Successfully!");
            setNewProject({project_name: "", description: "", start_date: "", end_date: ""});
        })
        .catch(err => {
            alert("Error creating project");
            console.error(err);
        });
    };

    return (
        <div className="container">
            <h2>Project Management</h2>

            <div>
                <h3>Add New Project</h3>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={newProject.project_name}
                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                />
                {/* <input
                    type="text"
                    placeholder="Admin Name"
                    value={newProject.created_by}
                    onChange={(e) => setNewProject({ ...newProject, created_by: e.target.value })}
                /> */}
                <button onClick={handleAddProject}>Add Project</button>
            </div>

            <h3>Project List</h3>
            <ul>
                {projects.map(project => (
                    <li key={project.project_id}>
                        <strong>{project.projectName}</strong> - {project.description} <br />
                        <small>Start: {project.startDate} | End: {project.endDate} | Created by: {project.createdBy?.name || "N/A"}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectManagement;
