import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../axiosInstance"; // ✅ Use global axios instance

const ExpenseForm = ({ groupId, onExpenseAdded }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const token = useSelector((state) => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!description.trim() || !amount) {
            setError("Please fill in all fields.");
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

            alert("Expense added successfully!");
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
        <div>
            <h4>Add Expense</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label>Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label>Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01" // ✅ Prevent negative values
                        step="0.01" // ✅ Ensure decimal values can be entered
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
        </div>
    );
};

export default ExpenseForm;
