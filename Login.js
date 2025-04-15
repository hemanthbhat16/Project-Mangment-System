import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../login.css";

function Login()
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [newMember, setNewMember] = useState({name: "", email: "", password: "", role: ""});
    const [teamMembers, setTeamMembers] = useState([]);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        try
        {
            const res = await axios.post("http://localhost:8080/api/user/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("loggedInUser", JSON.stringify(res.data));
            setLoggedInUser(res.data);
            // localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
            // setLoggedInUser(foundUser);
            alert("Login successfull!");
            // setTimeout(() => {
            //     navigate("/welcome");
            // }, 1000);
        }
        catch(error){
            alert("Invalid email or password. Please Try Again!");
        }
    };

    const handleAddMember = async () => {
        if(!newMember.name || !newMember.email || !newMember.password || !newMember.role)
        {
            alert("Please fill all fields");
            return;
        }

        // const users = JSON.parse(localStorage.getItem("users")) || [];
        // if(users.some(user => user.email === newMember.email))
        // {
        //     alert("User already exists!");
        //     return;
        // }

        // const newUser = {
        //     ...newMember,
        //     id: users.length + 1,
        //     team_number: loggedInUser.team_number,
        // };

        // users.push(newUser);
        // localStorage.setItem("users", JSON.stringify(users));
        // setTeamMembers([...teamMembers, newUser]);
        // setNewMember({name: "", email: "", password: "", role: ""});
        try{
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:8080/api/user/add", newMember, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            alert("Member added!");
            setTeamMembers([...teamMembers, res.data]);
            setNewMember({name: "", email: "", password: "", role: ""});
        }
        catch(error) {
            alert("Failed to add member");
        }
    };
    
    const handleProceedToWelcome = () => {
        navigate("/welcome");
    }

    return(
        <div>
            {!loggedInUser ? (
                <>
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button onClick={handleLogin}>Login</button>

                <p>Don't have an account ? <button onClick={() => navigate("/register")}>Register</button></p>
                </>
            ) : loggedInUser.role === "Admin" ? (
                <>
                <h2> Welcome, Admin!</h2>
                <h3>Add Team Members</h3>
                <input type="text" placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})}/>
                <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})}/>
                <input type="password" placeholder="Password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})}/>
                <input type="text" placeholder="Role" value={newMember.role} onChange={e => setNewMember({...newMember,role: e.target.value})}/>
                <button onClick={handleAddMember}>Add Member</button>

                <h3>Team Members</h3>
                <ul>
                    {teamMembers.map((member, index) => (
                        <li key={index}>{member.name} - {member.role}</li>
                    ))}
                </ul>

                <button onClick={handleProceedToWelcome}>Proceed to Welcome Page</button>
                </>
            ) : (
                <>
                <h2>Login successful!</h2>
                <button onClick={handleProceedToWelcome}>Go to Welcome Page</button>
                </>
            )}
        </div>
    );
}

export default Login;