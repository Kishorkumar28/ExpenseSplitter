import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "../components/axiosInstance"; 
import { toast } from "react-toastify";
import "../components/styles/Dashboard.css";
const Dashboard = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    
    const [userName, setUserName] = useState("User"); // ✅ Fix: Initialize username as "User"
    const [groups, setGroups] = useState([]);

    // ✅ Function to Decode JWT Token
    const decodeToken = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            return null;
        }
    };

    // ✅ Fetch username from token on component mount
    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            const decodedToken = decodeToken(token);
            setUserName(decodedToken?.unique_name || "User"); // ✅ Extracts username safely
            fetchGroups();
        }
    }, [token, navigate]);

    // ✅ Fetch Groups
    const fetchGroups = async () => {
        try {
            const response = await axios.get("/groups", { headers: { Authorization: `Bearer ${token}` } });
            setGroups(response.data || []);
        } catch (error) {
            console.error("❌ Error fetching groups:", error.response?.data || error.message);
            toast.error("Failed to load groups.");
        }
    };

    return (
        <div className="container mt-4">
            {/* ✅ Cool Welcome Section */}
            <div className="dash-info" >
                <div className="text-center dash-features">
                    <h1 className="display-5">👋 Hi {userName}, Welcome to Expense Splitter!</h1>
                    <h3 className="lead">Manage your group expenses easily and settle payments effortlessly.</h3>
                </div>

                {/* ✅ Features Section */}
                <div className="row text-center mb-4 dash-feature">
                    
                        <div className="card  dash-features">
                            <h2>💰 Add Expenses</h2>
                            <h3>Track group expenses and split them among members.</h3>
                        </div>
                    
                    
                        <div className="card  dash-features">
                            <h2>🤝 Settle Payments</h2>
                            <h3>See who owes what and quickly settle debts.</h3>
                        </div>
                    
                    
                        <div className="card dash-features">
                            <h2>📊 View Balances</h2>
                            <h3>Check real-time balances within your groups.</h3>
                        </div>
                    
                </div>

            </div>
            

            {/* ✅ Groups Section */}
            <div className="your-groups">
                <h2>Your Groups</h2>
            </div>
            
            {groups.length === 0 ? (
                <h2 className="empty-joined-groups-text" >You haven't joined any groups yet. <Link to="/groups">Join or create a group now!</Link></h2>
            ) : (
                <div className="list-group user-group-dashboard">
                    {groups.map((group) => (
                        <div key={group.groupId} className="list-group-item user-dash-groups">
                            <span title={group.name}>
                                {group.name.length > 20 ? `${group.name.substring(0, 20)}...` : group.name}
                            </span>

                            <Link to={`/groups/${group.groupId}/expenses`} className="btn btn-sm btn-primary view-group-btn">View Group</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
