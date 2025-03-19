import React from "react";
import { Link } from "react-router-dom";
import "../components/styles/WelcomePage.css"; 

const WelcomePage = () => {
    // ✅ Check if user is logged in.
    const isLoggedIn = !!localStorage.getItem("token"); 

    return (
        <div className="welcome-container">
            {/* Background Animation */}
            <div className="animated-bg"></div>

            <div className="welcome-content">
                <h1 className="welcome-title">💰 Expense Splitter</h1>
                <h2 className="welcome-subtitle">Track, Split, and Settle Expenses Easily!</h2>
                <p className="welcome-description">
                    Manage group expenses and share costs seamlessly with your friends and family.
                </p>

                {/* ✅ Hide login/register buttons if user is logged in */}
                {isLoggedIn ? (
                    <p className="logged-in-text">✅ Logged In</p> // ✅ Show "Logged In"
                ) : (
                    <div className="welcome-buttons">
                        <Link to="/register" className="btn welcome-btn signup-btn">Sign Up</Link>
                        <Link to="/login" className="btn welcome-btn login-btn">Log In</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomePage;
