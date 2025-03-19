import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles/Profile.css";

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
        <div className="profile-containers-div"  >
                <div className="profile-container">
                    <h2 className="profile-title">👤 My Profile</h2>
                    {user ? (
                        <div className="profile-info">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>

                            {/* Profile Actions */}
                            <div className="profile-actions">
                                <Link to="/change-username" className="btn btn-warning">
                                    ✏️ Change Username
                                </Link>
                                <Link to="/change-password" className="btn btn-danger">
                                    🔒 Change Password
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <p>Loading user details...</p>
                    )}
                </div>
        </div>
        
    );
};

export default Profile;
