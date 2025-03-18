import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Group";
import Navbar from "./components/Navbar";
import GroupExpenses from "./pages/GroupExpenses";
import PrivateRoute from "./components/utils/PrivateRoute";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ChangeUsername from "./pages/ChangeUsername";
import "../src/App.css";
import WelcomePage from "./pages/WelcomePage";
const App = () => {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/" element={<WelcomePage />} />  {/* Default Route */}
                    {/* Protected Routes (Require JWT Authentication) */}
                    <Route element={<PrivateRoute />}>
                        
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/groups/:groupId/expenses" element={<GroupExpenses />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/change-username" element={<ChangeUsername />} />
                    </Route>
                </Routes>
            </div>
        </Router>
        </>
    );
};

export default App;
