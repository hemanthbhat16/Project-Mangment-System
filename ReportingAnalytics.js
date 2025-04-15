// import React, {useState, useEffect} from "react";
// import {Bar, Pie} from "react-chartjs-2";
// import "chart.js/auto";
// import axios from "axios";
// import "../reportingAnalytics.css"

// function ReportingAnalytics() 
// {
//     const [projects, setProjects] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [filteredTasks, setFilteredTasks] = useState([]);

//     useEffect(() => {
//         const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
//         const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
//         setProjects(storedProjects);
//         setTasks(storedTasks);
//     }, []);

//     const handleProjectSelection = (projectName) => {
//         const project = projects.find(p => p.project_name === projectName);
//         setSelectedProject(project);

//         const relatedTasks = tasks.filter(task => task.project_name === projectName);
//         setFilteredTasks(relatedTasks);
//     };

//     const completedTasks = filteredTasks.filter(task => task.status === "Completed").length;
//     const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress").length;
//     const pendingTasks = filteredTasks.filter(task => task.status === "Pending").length;
//     const totalTasks = filteredTasks.length || 1;

//     const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

//     const taskStatusChartData = {
//         labels: ["Completed", "In Progress", "Pending"],
//         datasets: [
//             {
//                 label: "Task Status",
//                 data: [completedTasks, inProgressTasks, pendingTasks],
//                 backgroundColor: ["#4caf50", "#ffeb3b", "f44336"],
//             },
//         ],
//     };

//     const resourceUtilizationChartData = {
//         labels: filteredTasks.map(task => task.assigned_to),
//         datasets: [
//             {
//                 label: "Resource Utiliztion",
//                 data: filteredTasks.map(() => 1),
//                 backgroundColor: ["#3f51b5", "#ff9800", "#9c27b0", "#00bcd4"],
//             },
//         ],
//     };

//     return(
//         <div className="container">
//             <h2>Reporting & Analytics</h2>

//             <h3>Select a Project</h3>
//             <select onChange={(e) => handleProjectSelection(e.target.value)} defaultValue="">
//                 <option value="" disabled>Select a Project</option>
//                 {projects.map(proj => (
//                     <option key={proj.project_id} value={proj.project_name}>{proj.project_name}</option>
//                 ))}
//             </select>

//             {selectedProject && (
//                 <div>
//                     <h3>Project Details</h3>
//                     <p><strong>Project Name: </strong>{selectedProject.project_name}</p>
//                     <p><strong>Description: </strong>{selectedProject.description}</p>
//                     <p><strong>Start Date: </strong>{selectedProject.start_date}</p>
//                     <p><strong>End Date: </strong>{selectedProject.end_date}</p>
//                     <p><strong>Created By: </strong>{selectedProject.created_by}</p>

//                     <h3>Task Completion Rate: {completionRate}%</h3>

//                     <div style={{width: "60%", margin: "auto"}}>
//                         <Bar data = {taskStatusChartData}/>
//                     </div>

//                     <h3>Resource Utiliztion</h3>
//                     <div style={{width: "50%", margin: "auto"}}>
//                         <Pie data={resourceUtilizationChartData}/>
//                     </div>

//                     <h3>Tasks for {selectedProject.project_name}</h3>
//                     <ul>
//                         {filteredTasks.map(task => (
//                             <li key={task.task_id}>
//                                 <strong>{task.task_name}</strong> - {task.status} (Assigned to: {task.assigned_to})
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ReportingAnalytics;

import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios"; 
import "../reportingAnalytics.css";

function ReportingAnalytics() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Fetch projects and tasks data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get("http://localhost:8080/api/project/project", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token for authentication
          },
        });
        const tasksResponse = await axios.get("http://localhost:8080/api/task/task", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Fetched Projects:", projectsResponse.data); // Log projects data
        console.log("Fetched Tasks:", tasksResponse.data); // Log tasks data

        setProjects(projectsResponse.data);  // Setting projects data
        setTasks(tasksResponse.data);        // Setting tasks data
      } catch (error) {
        console.error("Error fetching projects or tasks:", error);
      }
    };

    fetchData();
  }, []);

  // Handle project selection and filtering tasks by selected project
  const handleProjectSelection = (projectName) => {
    console.log("Selected Project:", projectName);

    const project = projects.find((p) => p.projectName === projectName);
    setSelectedProject(project);

    const relatedTasks = tasks.filter((task) => task.project.projectName === projectName);
    setFilteredTasks(relatedTasks);

    console.log("Filtered Tasks:", relatedTasks);
  };

  // Calculate task status counts
  const completedTasks = filteredTasks.filter((task) => task.status === "Completed").length;
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress").length;
  const pendingTasks = filteredTasks.filter((task) => task.status === "Pending").length;
  const totalTasks = filteredTasks.length || 1;

  // Calculate completion rate percentage
  const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

  // Chart data for task status
  const taskStatusChartData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        label: "Task Status",
        data: [completedTasks, inProgressTasks, pendingTasks],
        backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
      },
    ],
  };

  // Chart data for resource utilization
  const resourceUtilizationChartData = {
    labels: filteredTasks.map((task) => task.assignedTo?.name || "Unassigned"),
    datasets: [
      {
        label: "Resource Utilization",
        data: filteredTasks.map(() => 1),
        backgroundColor: ["#3f51b5", "#ff9800", "#9c27b0", "#00bcd4"],
      },
    ],
  };

  return (
    <div className="container">
      <h2>Reporting & Analytics</h2>

      <h3>Select a Project</h3>
      <select onChange={(e) => handleProjectSelection(e.target.value)} defaultValue="">
        <option value="" disabled>Select a Project</option>
        {projects.map((proj) => (
          <option key={proj.id} value={proj.projectName}>
            {proj.projectName}
          </option>
        ))}
      </select>

      {selectedProject && (
        <div>
          <h3>Project Details</h3>
          <p><strong>Project Name: </strong>{selectedProject.projectName}</p>
          <p><strong>Description: </strong>{selectedProject.description}</p>
          <p><strong>Start Date: </strong>{selectedProject.startDate}</p>
          <p><strong>End Date: </strong>{selectedProject.endDate}</p>
          {/* <p><strong>Created By: </strong>{selectedProject.createdByy}</p> */}

          <h3>Task Completion Rate: {completionRate}%</h3>

          <div style={{ width: "60%", margin: "auto" }}>
            <Bar data={taskStatusChartData} />
          </div>

          <h3>Resource Utilization</h3>
          <div style={{ width: "50%", margin: "auto" }}>
            <Pie data={resourceUtilizationChartData} />
          </div>

          <h3>Tasks for {selectedProject.projectName}</h3>
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.task_id}>
                <strong>{task.taskName}</strong> - {task.status} (Assigned to: {task.assignedTo?.name})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReportingAnalytics;
