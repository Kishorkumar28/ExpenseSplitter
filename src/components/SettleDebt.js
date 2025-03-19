import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Function to Decode JWT Token
const decodeToken = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        return null;
    }
};

const SettleDebt = ({ groupId, onDebtSettled }) => {
    const token = useSelector(state => state.auth.token);
    const decodedToken = token ? decodeToken(token) : null;

    const userId = decodedToken?.nameid; // ✅ Extract user ID
    const userName = decodedToken?.unique_name; // ✅ Extract username

    const [creditorId, setCreditorId] = useState("");
    const [amount, setAmount] = useState("");
    const [creditors, setCreditors] = useState([]); // ✅ Store only people to whom user owes money

    useEffect(() => {
        fetchUserDebts();
    }, []);

    // ✅ Fetch balances and filter only users to whom this user owes money
    const fetchUserDebts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}/balances`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // console.log("🔍 Balances Response:", response.data);

            // ✅ Filter balances where the logged-in user is the debtor
            const userDebts = response.data.filter(debt => Number(debt.debtorId) === Number(userId));

            // ✅ Set creditors (only those to whom the user owes money)
            setCreditors(userDebts);
        } catch (error) {
            console.error("❌ Error fetching user debts:", error);
        }
    };

    const handleSettleDebt = async (e) => {
        e.preventDefault();

        if (!creditorId || !amount) {
            toast.warn("⚠️ Please fill in all fields.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5293/api/groups/${groupId}/settle`,
                {
                    debtorId: Number(userId), // ✅ Auto-set debtor as the logged-in user
                    creditorId: Number(creditorId),
                    amount: Number(amount)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Debt settled successfully!");
            setCreditorId("");
            setAmount("");
            onDebtSettled(); // Refresh balance list
            fetchUserDebts(); // ✅ Refresh creditors list
        } catch (error) {
            console.error("❌ Error settling debt:", error);
            toast.error(error.response?.data?.message || "Failed to settle debt.");
        }
    };

    return (
        <div className="settle-debt-container">
            <h2 id="settle-debt">Settle Debt</h2>
            <form onSubmit={handleSettleDebt} className="debt-input-form">
                {/* ✅ Auto-assign debtor (logged-in user) */}
                <div className="debt-input-div list-group-item">
                    <h3>Debtor</h3>
                    <span>{userName ? `${userName} (ID: ${userId})` : "Loading..."}</span>
                </div>

                {/* ✅ Select Creditor (Only people the user owes) */}
                <div className="debt-input-div list-group-item">
                    <h3>Creditor</h3>
                    <select
                        className="form-control debt-input-field"
                        value={creditorId}
                        onChange={(e) => setCreditorId(e.target.value)}
                        required
                    >
                        <option value="">Select Creditor</option>
                        {creditors.length === 0 ? (
                            <option disabled>No outstanding debts</option>
                        ) : (
                            creditors.map(({ creditorId, creditorName, amount }) => (
                                <option key={creditorId} value={creditorId}>
                                    {creditorName} (Owes ₹{amount.toFixed(2)})
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* ✅ Amount Field */}
                <div className="debt-input-div list-group-item">
                    <h3>Amount</h3>
                    <input
                        type="number"
                        className="form-control debt-input-field"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary group-button">Settle Debt</button>
            </form>
        </div>
    );
};

export default SettleDebt;
