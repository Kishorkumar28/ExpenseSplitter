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
    const [groupName, setGroupName] = useState(""); // 🔹 New state for storing the group name
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0); // ✅ Runs only once when the component mounts
    }, []);
    useEffect(() => {
        
        if (!groupId) {
            setError("Invalid group. Please try again.");
            setLoading(false);
            return;
        }
        fetchGroupDetails(); // 🔹 Fetch group details (including name)
        fetchExpenses();
        setupWebSocket(); // ✅ Initialize WebSocket
    }, [token, groupId]);

    // 🔹 Function to fetch group details
    const fetchGroupDetails = async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGroupName(response.data.name); // 🔹 Store the group name
        } catch (error) {
            setError("Failed to load group details.");
        }
    };

    // 🔹 Function to fetch expenses
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

            setExpenses(response.data);
        } catch (error) {
            setError("Failed to load expenses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Setup WebSocket to listen for changes
    const setupWebSocket = () => {
        const ws = new WebSocket("ws://localhost:5293/ws");

        ws.onopen = () => setSocket(ws);

        ws.onmessage = (event) => {
            if (event.data.startsWith("new_expense:")) {
                const updatedGroupId = event.data.split(":")[1];
                if (updatedGroupId === groupId) {
                    fetchExpenses();
                }
            }

            if (event.data === "debt_settled") {
                fetchExpenses();
            }
        };

        ws.onclose = () => setTimeout(setupWebSocket, 3000);
    };

    return (
        <div className="container-expense-form">
            {/* 🔹 Display the group name dynamically */}
            <h1 id="group-expenses">
                Group Expenses {groupName ? `- ${groupName}` : ""}
            </h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Loading expenses...</p>}

            {!loading && (
                <>  
                    <div className="expense-and-settle">
                        <ExpenseForm groupId={groupId} onExpenseAdded={fetchExpenses} />
                        <SettleDebt groupId={groupId} onDebtSettled={fetchExpenses} />
                    </div>
                    <BalanceList groupId={groupId} />
                    <ExpenseList expenses={expenses} />
                </>
            )}
        </div>
    );
};

export default GroupExpenses;
