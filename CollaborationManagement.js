import React, { useState, useEffect } from "react";
import axios from "axios";
import "../collaborationManagement.css"

function CollaborationManagement() 
{
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({
        projectId: "",
        userId: "",
        messageText: "",
        file: null
    });
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    const fetchMessages = async() => {
        try{
            const response = await axios.get("http://localhost:8080/api/collab/all", {
                headers: 
                { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setMessages(response.data);
        }
        catch(error) {
            console.error("Error fetching messages:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/project/project", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Fetched Projects:", response.data);  // Check what projects are being fetched
            setProjects(response.data);  // Set the projects state with the fetched data
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/user/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Fetched Users:", response.data);  // Check the users data
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    // useEffect(() => {

    //     fetchMessages();
    //     const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    //     const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    //     setProjects(storedProjects);
    //     setUsers(storedUsers);

    //     if(storedProjects.length > 0) {
    //         const firstProjectId = storedProjects[0].id;
    //         setSelectedProjectId(firstProjectId);
    //         setNewMessage((prev) => ({...prev, projectId: firstProjectId}));
    //     }

    // }, []);

    useEffect(() => {
        fetchMessages();
        fetchProjects();
        fetchUsers();
    }, []);
    
    const handleSendMessage = async () => {
            // const matchingProject = projects.find(proj => proj.project_name === newMessage.project_name);
            // if(!matchingProject)
            // {
            //     alert("Project does not exist!");
            //     return;
            // }

            // const matchingUser = users.find(user => user.name === newMessage.user_name);
            // if(!matchingUser)
            // {
            //     alert("User does not exist!");
            //     return;
            // }

            // const newMessageData = {
            //     message_id: messages.length + 1,
            //     project_name: newMessage.project_name,
            //     user_name: newMessage.user_name,
            //     text: newMessage.text,
            //     timestamp: new Date().toLocaleString()
            // };

            // const updatedMessages = [...messages, newMessageData];
            // setMessages(updatedMessages);

            // localStorage.setItem("messages", JSON.stringify(updatedMessages));
            // console.log("New Message Sent:", newMessageData);
            // console.log("Updated Messages List:", updatedMessages);
            // setNewMessage({project_name: "", user_name: "", text: ""});
            const { projectId, userId, messageText, file } = newMessage;

            if(!projectId || !userId || !messageText) {
                alert("Please fill in all required fields");
                return;
            }

            console.log("Sending message with data:", newMessage);
            try{
                const formData = new FormData();
                formData.append("projectId", projectId);
                formData.append("userId", userId);
                formData.append("messageText", messageText);
                if(file) formData.append("file", file);

                const token = localStorage.getItem("token");

                await axios.post("http://localhost:8080/api/collab/send", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}` 
                    }
                });

                fetchMessages();
                setNewMessage({projectId, userId: "", messageText: "", file: null});
            }
            catch(error) {
                console.error("Error sending message:", error);
                alert("Failed to send message");
            }
};

    const handleFileUpload = (event) => {
        setNewMessage({...newMessage, file: event.target.files[0]});
    };

//     return(
//         <div className="container">
//             <h2>Team Collaboration</h2>
//             <div>
//                 <h3>Send a Message</h3>
//                 <input
//                 type="text"
//                 placeholder="Project Name"
//                 value={newMessage.project_name}
//                 onChange={(e) => setNewMessage({...newMessage, project_name: e.target.value})}
//                 />
//                 <input
//                 type="text"
//                 placeholder="Enter your Name"
//                 value={newMessage.user_name}
//                 onChange={(e) => setNewMessage({...newMessage, user_name: e.target.value})}
//                 />
//                 <textarea
//                  placeholder="Enter Message"
//                  value={newMessage.text}
//                  onChange={(e) => setNewMessage({...newMessage, text: e.target.value})}
//                 />
//                 <input
//                 type="file"
//                 onChange={handleFileUpload}
//                 />
//                 <button onClick={handleSendMessage}>Send</button>
//             </div>

//             <h3>Project Discussions</h3>
//             {projects.map(proj => (
//                 <div key={proj.project_name}>
//                 <ul>
//                 {messages.filter(msg => msg.project_name === proj.project_name).map(msg => (
//                     <li key={msg.message_id}>
//                         <strong>{msg.user_name}:</strong> {msg.text} <br/>
//                         <small>{msg.timestamp}</small>
//                     </li>
//                 ))}
//             </ul>
//             </div>
//            ))}
//         </div>
//     );
// }
return (
    <div className="container">
        <h2>Team Collaboration</h2>
        <div>
            <h3>Send a Message</h3>
            <select
                value={newMessage.projectId}
                onChange={(e) => {
                    const projectId = e.target.value;
                    setNewMessage({ ...newMessage, projectId });
                    setSelectedProjectId(projectId);
                }}
            >
                {/* <option value="">Select Project</option>
                {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                ))} */}
                    <option value="">Select Project</option>
                    {projects.length > 0 ? (
                        projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.projectName}
                            </option>
                        ))
                    ) : (
                        <option value="">No projects available</option>
                    )}
            </select>

            <select
                value={newMessage.userId}
                onChange={(e) => setNewMessage({ ...newMessage, userId: e.target.value })}
            >
                <option value="">Select User</option>
                {/* {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))} */}
                    <option value="">Select User</option>
                    {users.length > 0 ? (
                        users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))
                    ) : (
                        <option value="">No users available</option>
                    )}
            </select>

            <textarea
                placeholder="Message Text"
                value={newMessage.messageText}
                onChange={(e) => setNewMessage({ ...newMessage, messageText: e.target.value })}
            />
{/* 
            <input type="file" onChange={handleFileUpload} /> */}
            <button onClick={handleSendMessage}>Send</button>
        </div>

        <h3>Project Discussions</h3>
        <ul>
            {messages.map((msg, index) => (
                <li key={index}>
                    <strong>{msg.user?.name}:</strong> {msg.messageText}<br />
                    <small>{msg.timestamp}</small><br />
                    {msg.fileName && (
                        <a
                            href={`http://localhost:8080/uploads/${msg.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {msg.fileName}
                        </a>
                    )}
                </li>
            ))}
        </ul>
    </div>
);
}

export default CollaborationManagement;