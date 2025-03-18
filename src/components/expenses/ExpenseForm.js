import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../axiosInstance"; // ✅ Use global axios instance
import { toast } from "react-toastify";
import "../styles/Expenseform.css";

const ExpenseForm = ({ groupId, onExpenseAdded }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const token = useSelector((state) => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!description.trim() || !amount) {
            toast.warn("⚠️ Please enter a valid description and amount.");
            return;
        }

        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            setError("Amount should be a positive number.");
            return;
        }

        if (!groupId) {
            setError("Invalid group. Please try again.");
            return;
        }

        try {
            await axios.post(
                `/groups/${Number(groupId)}/expenses`, // ✅ Corrected API Route
                { description, amount: expenseAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Expense added successfully!");
            setDescription("");
            setAmount("");
            onExpenseAdded(); // ✅ Refresh expenses list
        } catch (error) {
            console.error("Error adding expense:", error);
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to add expense."
            );
        }
    };

    return (
        <div className="expense-form-div" >
            <h2 id="add-expense">Add Expense</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="expense-input-form " >
                <div id="add-expense-desc" className="mb-2 expense-input-div list-group-item">
                    <h3>Description</h3>
                    <input
                        type="text"
                        className="form-control expense-input-field"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2 expense-input-div list-group-item" id="expense-amount">
                    <h3>Amount</h3>
                    <input
                        type="number"
                        className="form-control expense-input-field"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01" // ✅ Prevent negative values
                        step="0.01" // ✅ Ensure decimal values can be entered
                    />
                </div>
                <button type="submit" id="add-expense-button" className="btn btn-primary group-button">Add Expense</button>
            </form>
        </div>
    );
};

export default ExpenseForm;
