import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const token = useSelector(state => state.auth.token);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get("http://localhost:5293/api/auth/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error("❌ Error fetching user details:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>👤 My Profile</h2>
            {user ? (
                <div className="card p-3">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>

                    {/* Change Username */}
                    <Link to="/change-username" className="btn btn-warning mb-2">
                        ✏️ Change Username
                    </Link>

                    {/* Change Password */}
                    <Link to="/change-password" className="btn btn-danger">
                        🔒 Change Password
                    </Link>
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
};

export default Profile;
