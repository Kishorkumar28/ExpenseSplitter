import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const BalanceList = ({ groupId }) => {
    const token = useSelector((state) => state.auth.token);
    const [balances, setBalances] = useState({}); // 🔹 Use an object instead of an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBalances();

        // 🔹 Establish WebSocket Connection
        const wsInstance = new WebSocket("ws://localhost:5293/ws");

        wsInstance.onopen = () => {
            console.log("🔗 WebSocket Connected for Balances");
        };

        wsInstance.onmessage = (event) => {
            console.log("📢 WebSocket Message:", event.data);
        
            if (event.data.startsWith("balance_updated")) {
                console.log("🔄 Refreshing balances...");
                fetchBalances();
            } else if (event.data.startsWith("debt_settled")) {
                console.log("✅ Debt settled! Refreshing balances...");
                fetchBalances();
            }
        };

        wsInstance.onerror = (error) => console.error("❌ WebSocket Error:", error);

        wsInstance.onclose = () => {
            console.log("❌ WebSocket Disconnected. Attempting to reconnect...");
            setTimeout(() => new WebSocket("ws://localhost:5293/ws"), 5000); // 🔹 Auto-reconnect after 5s
        };

        return () => wsInstance.close(); // Cleanup WebSocket on component unmount
    }, [groupId]);

    const fetchBalances = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}/balances`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Balance Fetch API Response:", response.data); // Debug Response
            setBalances(response.data);
        } catch (error) {
            console.error("❌ Error fetching balances:", error);
            setError("Failed to load balances.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4>Group Balances</h4>
            {error && <p className="text-danger">{error}</p>}
            {loading && <p>Loading balances...</p>}
            
            {!loading && Object.keys(balances).length === 0 && <p>No balances found.</p>}
            
            {!loading && Object.keys(balances).length > 0 && (
                <ul className="list-group">
                    {Object.entries(balances).map(([debtorId, creditors]) =>
                        Object.entries(creditors).map(([creditorId, amount]) => (
                            <li key={`${debtorId}-${creditorId}`} className="list-group-item">
                                User {debtorId} owes ₹{amount.toFixed(2)} to User {creditorId}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default BalanceList;
