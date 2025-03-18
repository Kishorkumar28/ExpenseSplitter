import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../components/services/authService";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Expense Splitter</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/groups">Groups</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
