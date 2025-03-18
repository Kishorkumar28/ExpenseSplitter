import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../components/services/authService";
import { toast } from "react-toastify";
import "./styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        logoutUser();
        toast.info("👋 Logged out successfully!");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
            <div className="">
                

                {/* Mobile Toggle Button */}
                {/* <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button> */}

                <div className="collapse navbar-collapse " id="navbarNav">
                    <div className="navbar-nav ms-auto">
                        {token ? (
                             
                                <div className="navbar-container" >
                                    <div className="navbar-left">
                                            <div className="nav-item profile-icon">
                                                <Link className="nav-link text-white" to="/dashboard"><i className="fa-solid fa-house"></i> Dashboard</Link>
                                            </div>
                                            <div className="nav-item profile-icon">
                                                <Link className="nav-link text-white" to="/groups"><i className="fa-solid fa-user-group"></i> Groups</Link>
                                            </div>
                                    </div>
                                    

                                    {/* Profile Dropdown */}
                                        
                                        <div className="dropdown-menu dropdown-menu-end navbar-right">
                                            <div className="profile-icon">
                                                <Link className="dropdown-item" to="/profile"><i className="fa-solid fa-user"></i> View Profile</Link>
                                            </div>
                                            
                                            <div><hr className="dropdown-divider" /></div>
                                            <div className="logout-icon  " onClick={handleLogout}>
                                                <i className="fa-solid fa-right-from-bracket"> </i> Logout
                                            </div>

                                        </div>
                                    
                                </div>
                           
                            
                        ) : (
                            <div className="navbar-container">
                                
                            
                                <div className="nav-item">
                                    <Link className="nav-link text-white" to="/login">🔑 Login</Link>
                                </div>
                                <div className="nav-item">
                                    <Link className="nav-link text-white" to="/register">📝 Register</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
