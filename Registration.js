import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Registration.css"

function Registration() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.password || !user.role) {
      alert("Please fill all fields!");
      return;
    }
    // const users = JSON.parse(localStorage.getItem("users")) || [];
    // const isAdminRegistered = users.some(u => u.role === "Admin");

    // if (users.length === 0 && user.role !== "Admin") {
    //   alert("The first registered user must be an Admin.");
    //   return;
    // }

    // if (isAdminRegistered) {
    //   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    //   if (!loggedInUser || loggedInUser.role !== "Admin") {
    //     alert("Only an Admin can register new users.");
    //     return;
    //   }
    // }

    // const team_number = users.length > 0 ? Math.max(...users.map(u => u.team_number || 0)) + 1 : 1;
    // const newUser = { ...user, id: users.length + 1, team_number };

    // users.push(newUser);
    // localStorage.setItem("users", JSON.stringify(users));

    // alert("Registration successful! You can now login.");
    // navigate("/login");

    try{
      const res = await axios.post("http://localhost:8080/api/user/signup", user);
      alert("Registration successfull");
      navigate("/login");
    }
    catch(error){
      alert(error.response?.data || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
      <input type="email" placeholder="Email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
      <input type="password" placeholder="Password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
      <select 
        value={user.role} 
        onChange={e => setUser({ ...user, role: e.target.value })} // Disable Admin selection after first user
      >
        <option value="Admin">Admin</option>
        <option value="User">User</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Registration;
