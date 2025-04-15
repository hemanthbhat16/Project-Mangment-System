import React, { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import "../welcome.css"

function Welcome() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);



    // Ensure a user is logged in, otherwise redirect to login
    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
            navigate("/login");  // Redirect to login if no user found
        }
        else {
            setUser(JSON.parse(storedUser)); // Set user state
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/login");
    };

    if(!user) return null;

    return (
        <div className="welcome-container">
            <h2>Welcome {user.name || user.email}!</h2>
            <nav className="navbar">
                <ul>
                    <li><Link to="/project-management">Project Management</Link></li>
                    <li><Link to="/task-management">Task Management</Link></li>
                    <li><Link to="/collaboration-management">Collaboration Management</Link></li>
                    <li><Link to="/reporting-analytics">Reporting & Analytics</Link></li>
                </ul>
            </nav>
            <button className = "logout-button"onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Welcome;
