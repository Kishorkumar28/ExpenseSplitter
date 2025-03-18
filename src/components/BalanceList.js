import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const BalanceList = ({ groupId }) => {
    const token = useSelector((state) => state.auth.token);
    const [balances, setBalances] = useState([]); // Change from object to array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBalances();
    
        const ws = new WebSocket("ws://localhost:5293/ws");
    
        ws.onopen = () => console.log("🔗 WebSocket Connected for Balances");
        ws.onmessage = (event) => {
            console.log("📢 WebSocket Message:", event.data);
            if (event.data.startsWith("balance_updated") || event.data.startsWith("new_expense")) {
                console.log("🔄 Refreshing balances...");
                fetchBalances(); // 🔹 Refresh balances when expense is added
            }
        };
        ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
        ws.onclose = () => console.log("❌ WebSocket Disconnected");
    
        return () => ws.close();
    }, [groupId]);
        
    const fetchBalances = async () => {
        setLoading(true);
        setError("");
    
        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}/balances`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("✅ Balance Fetch API Response:", response.data);
            
            if (!response.data || response.data.length === 0) {
                console.warn("⚠️ No outstanding debts in this group.");
                setBalances([]); // ✅ Empty list means "No balances"
            } else {
                setBalances(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn("⚠️ No balances found for this group.");
                setBalances([]); // ✅ Prevents error message from displaying
            } else {
                console.error("❌ Error fetching balances:", error);
                setError("Failed to load balances.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div>
            <h4>Group Balances</h4>
            {error && <p className="text-danger">{error}</p>}
            {loading && <p>Loading balances...</p>}
    
            {/* ✅ Show message when there are no debts */}
            {!loading && balances.length === 0 && (
                <p className="text-success">✅ All expenses are settled. No outstanding debts!</p>
            )}
    
            {/* ✅ Show list only if balances exist */}
            {!loading && balances.length > 0 && (
                <ul className="list-group">
                    {balances.map(({ debtorId, debtorName, creditorId, creditorName, amount }) => (
                        <li key={`${debtorId}-${creditorId}`} className="list-group-item">
                            User {debtorId} ({debtorName}) owes ₹{(amount ?? 0).toFixed(2)} to User {creditorId} ({creditorName})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
    
};

export default BalanceList;
