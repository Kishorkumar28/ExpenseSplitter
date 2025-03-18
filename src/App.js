import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Group";
import Navbar from "./components/Navbar";
import GroupExpenses from "./pages/GroupExpenses";
import PrivateRoute from "./components/utils/PrivateRoute";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mt-3">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected Routes (Require JWT Authentication) */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/groups/:groupId/expenses" element={<GroupExpenses />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
