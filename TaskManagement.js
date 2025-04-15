import React, { useState, useEffect } from "react";
import axios from "axios";
import "../taskManagement.css"

function TaskManagement() 
{
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [newTask, setNewTask] = useState({
        project_id: "",
        task_name: "",
        assigned_to: "",
        status: "Pending",
        priority: "Medium",
        due_date: ""
    });

    // const [editTaskId, setEditTaskId] = useState(null);

    useEffect(() => {
        // const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
        // const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // setProjects(storedProjects);
        // setUsers(storedUsers);

        // const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        // setTasks(storedTasks);
        fetchProjects();
        fetchUsers();
        fetchTasks();
    },[]);

    const fetchProjects = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/project/project", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects(res.data);
            console.log("Fetched Projects:", res.data);
        } 
        catch(error){
            console.error("Failed to fetch projects:", error);
        }
    };

    const fetchUsers = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/user/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }                
            });
            setUsers(res.data);
            console.log("Fetched Users:", res.data);
        }
        catch(error){
            console.error("Failed to fetch users:", error);
        }
    };

    const fetchTasks = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/task/task", {
                headers: {
                    Authorization: `Bearer ${token}`
                }  
            });
            setTasks(res.data);
        }
        catch(error){
            console.error("Failed to fetch tasks:", error);
        }
    };

    const handleAddTask = async () => {
        const matchingProject = projects.find((proj) => proj.id === newTask.project_id);
        console.log("Matching project:", matchingProject);
        if(!matchingProject)
        {
            alert("Project does not exist");
            return;
        }

        const matchingUser = users.find(user => user.id === newTask.assigned_to);
        if(!matchingUser)
        {
            alert("Assigned user does not exist");
            return;
        }

        // const newTaskData = {
        //     task_id: tasks.length + 1,
        //     project_id: matchingProject.project_id,
        //     ...newTask
        // };

        // const updatedTasks = [...tasks, newTaskData];
        // setTasks(updatedTasks);
        // localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        // console.log("New Task Added:",newTaskData);
        // console.log("Updated Task List:", updatedTasks);

        const taskToSend = {
            taskName: newTask.task_name,      
            priority: newTask.priority,
            status: newTask.status,
            dueDate: newTask.due_date, 
            project_id: matchingProject.id,
            assigned_to: matchingUser.id
        };

        console.log("Sending Task:", taskToSend);

        try{
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:8080/api/task/create", taskToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }   
        });
        console.log("Response from server:", res.data);
        setTasks([...tasks, res.data]);
        setNewTask({
                project_id: "",
                task_name: "",
                assigned_to: "",
                status: "Pending",
                priority: "Medium",
                due_date: ""               
            });
        }
        catch(error) {
            console.error("Error adding Task:", error);
            alert("Failed to add task");
        }
        };

        // const handleUpdateTask = async () => {
        //     // const updatedTasks = tasks.map(task => 
        //     //     task.task_id === editTaskId ? { ...task, ...newTask } : task
        //     // );
        //     // setTasks(updatedTasks);
        //     // localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        //     try{
        //     await axios.get(`http://localhost:8080/api/task/${editTaskId}`, newTask);
        //     fetchTasks();
        //     setEditTaskId(null);
        //     setNewTask(
        //         {
        //             project_id: "",
        //             task_name: "",
        //             assigned_to: "",
        //             status: "Pending",
        //             priority: "Medium",
        //             due_date: ""
        //         }
        //     );
        // }
        // catch(error) {
        //     console.error("Failed to update Task:", error);
        // }
        // };

        // const handleDeleteTask = async (id) => {
        //     // const filteredTasks = tasks.filter(task => task.task_id !== id);
        //     try{
        //     await axios.delete(`http://localhost:8080/api/tasks/${id}`);
        //     setTasks(tasks.filter(t => t.task_id !== id));
        //     // localStorage.setItem("tasks", JSON.stringify(filteredTasks));
        //     }
        //     catch(error){
        //         console.error("Failed to delete Task:", error);
        //     }
        // };

        // console.log("Projects in dropdown:", projects);

    return(
        <div className="container">
            <h2>Task Management</h2>
            <div className="add-task-form">
                {/* <input
                type="text"
                placeholder="Project Name"
                value={newTask.project_name}
                onChange={(e) => setNewTask({...newTask, project_name: e.target.value})}
                /> */}
             <select
             value={newTask.project_id}
             onChange={(e) => setNewTask({ ...newTask, project_id: parseInt(e.target.value) })}
              >
             <option value="">Select Project</option>
             {projects.map((project) => (
              <option key={project.id} value={project.id}>
            {project.projectName || "Unnamed Project"}  {/* You can display project_name in the dropdown */}
              </option>
                    ))}
                </select>
                <input
                type="text"
                placeholder="Task Name"
                value={newTask.task_name}
                onChange={(e) => setNewTask({...newTask, task_name: e.target.value})}
                />
                {/* <input
                type="text"
                placeholder="Assigned To (User Name)"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                /> */}
                <select
                value={newTask.assigned_to}
                onChange={(e) =>
                setNewTask({ ...newTask, assigned_to: parseInt(e.target.value) })
                 }
                >
                  <option value="">Select User</option>
                 {users.map((user) => (
                       <option key={user.id} value={user.id}>
                   {user.name}
                    </option>
                  ))}
                </select>
                <select value={newTask.status} onChange={(e) => setNewTask({
                    ...newTask, status: e.target.value})}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                </select>
                <select value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="Low">Low</option> 
                  <option value="Medium">Medium</option> 
                  <option value="High">High</option>
                </select>
                <input
                type="date"
                placeholder="Due Date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
                <button onClick={handleAddTask}>Add Task</button>
                {/* <button onClick={editTaskId ? handleUpdateTask : handleAddTask}> { editTaskId ? "Update Task" : "Add Task"}</button> */}
            </div>

            <h3>Task List</h3>
            {/* <ul>
                {tasks.map((task) => (
                    <li key={task.task_id}>
                        <strong>{task.task_name}</strong> - Project: {task.project_name} <br/>
                        Assigned To: {task.assigned_to} | Status: {task.status} | Priority: {task.priority} <br/>
                        Due Date: {task.due_date}
                    </li>
                ))}
            </ul> */}
            <ul>
                {tasks.map((task) => (
                    <li key={task.task_id}>
                        <strong>{task.taskName}</strong> - Project: {task.project ? task.project.projectName : "No project"} <br/>
                         | Status: {task.status} | Priority: {task.priority} <br/>
                        Due Date: {task.dueDate} <br/>
                        <div className="task-actions">
                        {/* <button className="edit-btn" onClick={() => {
                            setEditTaskId(task.task_id);
                            setNewTask({
                                project_name: task.project_name,
                                task_name: task.task_name,
                                assigned_to: task.assigned_to,
                                status: task.status,
                                priority: task.priority,
                                due_date: task.due_date
                            });
                        }}>Edit</button>
                        <button className = "delete-btn" onClick={() => handleDeleteTask(task.task_id)}>Delete</button> */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskManagement;