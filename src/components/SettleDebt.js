import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SettleDebt = ({ groupId, onDebtSettled }) => {
    const [debtorId, setDebtorId] = useState("");
    const [creditorId, setCreditorId] = useState("");
    const [amount, setAmount] = useState("");
    const [members, setMembers] = useState([]); // ✅ Store group members
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        fetchGroupMembers();
    }, []);

    const fetchGroupMembers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5293/api/groups/${groupId}/members`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMembers(response.data);
        } catch (error) {
            console.error("❌ Error fetching members:", error);
        }
    };

    const handleSettleDebt = async (e) => {
        e.preventDefault();

        if (!debtorId || !creditorId || !amount) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5293/api/groups/${groupId}/settle`,
                {
                    debtorId: Number(debtorId),
                    creditorId: Number(creditorId),
                    amount: Number(amount)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Debt settled successfully!");
            setDebtorId("");
            setCreditorId("");
            setAmount("");
            onDebtSettled(); // Refresh balance list
        } catch (error) {
            console.error("❌ Error settling debt:", error);
            alert(error.response?.data?.message || "Failed to settle debt.");
        }
    };

    return (
        <div className="mt-3">
            <h4>Settle Debt</h4>
            <form onSubmit={handleSettleDebt}>
                <div className="mb-2">
                    <label>Debtor</label>
                    <select
                        className="form-control"
                        value={debtorId}
                        onChange={(e) => setDebtorId(e.target.value)}
                        required
                    >
                        <option value="">Select Debtor</option>
                        {members.map((member) => (
                            <option key={member.userId} value={member.userId}>
                                {member.username} (ID: {member.userId})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label>Creditor</label>
                    <select
                        className="form-control"
                        value={creditorId}
                        onChange={(e) => setCreditorId(e.target.value)}
                        required
                    >
                        <option value="">Select Creditor</option>
                        {members.map((member) => (
                            <option key={member.userId} value={member.userId}>
                                {member.username} (ID: {member.userId})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label>Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Settle Debt</button>
            </form>
        </div>
    );
};

export default SettleDebt;
