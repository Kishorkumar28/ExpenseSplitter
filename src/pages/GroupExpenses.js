import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpensesList";
import BalanceList from "../components/BalanceList";
import SettleDebt from "../components/SettleDebt";
import "../components/styles/Expenseform.css";

const GroupExpenses = () => {
    const { groupId } = useParams();
    const token = useSelector((state) => state.auth.token);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!groupId) {
            setError("Invalid group. Please try again.");
            setLoading(false);
            return;
        }
        fetchExpenses();
        setupWebSocket(); // ✅ Initialize WebSocket
    }, [token, groupId]);

    const fetchExpenses = async () => {
        if (!token) {
            setError("Authentication required. Please log in.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}/expenses`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Fetched Expenses:", response.data);
            setExpenses(response.data);
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
            setError("Failed to load expenses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = () => {
        const ws = new WebSocket("ws://localhost:5293/ws");

        ws.onopen = () => {
            console.log("✅ WebSocket Connected");
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log("📢 WebSocket Message Received:", event.data);

            if (event.data.startsWith("new_expense:")) {
                const updatedGroupId = event.data.split(":")[1];
                if (updatedGroupId === groupId) {
                    console.log("🔄 Fetching updated expenses...");
                    fetchExpenses(); // ✅ Refresh expenses when a new expense is added
                }
            }

            if (event.data === "debt_settled") {
                console.log("💰 Debt settled, refreshing balances...");
                fetchExpenses(); // Refresh expenses
            }
        };

        ws.onclose = () => {
            console.log("⚠️ WebSocket Disconnected. Reconnecting in 3s...");
            setTimeout(setupWebSocket, 3000);
        };
    };

    return (
        <div className="container-expense-form">
            <h1>Group Expenses</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Loading expenses...</p>}

            {!loading && (
                <>
                    <ExpenseForm groupId={groupId} onExpenseAdded={fetchExpenses} />
                    <ExpenseList expenses={expenses} />
                    <BalanceList groupId={groupId} />
                    <SettleDebt groupId={groupId} onDebtSettled={fetchExpenses} />
                </>
            )}
        </div>
    );
};

export default GroupExpenses;
