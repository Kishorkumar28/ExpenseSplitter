import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../components/axiosInstance"; // ✅ Uses global axios instance
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpensesList";

const Dashboard = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchExpenses();
        }
    }, [token, navigate]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get("/expenses"); // ✅ Uses global axios instance
            setExpenses(response.data || []);
        } catch (error) {
            console.error("Error fetching expenses:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Dashboard</h2>
            <ExpenseForm onExpenseAdded={fetchExpenses} />
            <ExpenseList expenses={expenses} />
        </div>
    );
};

export default Dashboard;
