import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SettleDebt = ({ groupId, onDebtSettled }) => {
    const [debtorId, setDebtorId] = useState("");
    const [creditorId, setCreditorId] = useState("");
    const [amount, setAmount] = useState("");
    const token = useSelector((state) => state.auth.token);

    const handleSettleDebt = async (e) => {
        e.preventDefault();

        if (!debtorId || !creditorId || !amount) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5293/api/groups/${groupId}/settle`,
                { debtorId, creditorId, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Debt settled successfully!");
            setDebtorId("");
            setCreditorId("");
            setAmount("");
            onDebtSettled(); // Refresh balance list
        } catch (error) {
            console.error("Error settling debt:", error);
            alert("Failed to settle debt.");
        }
    };

    return (
        <div className="mt-3">
            <h4>Settle Debt</h4>
            <form onSubmit={handleSettleDebt}>
                <div className="mb-2">
                    <label>Debtor ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={debtorId}
                        onChange={(e) => setDebtorId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label>Creditor ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={creditorId}
                        onChange={(e) => setCreditorId(e.target.value)}
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
                    />
                </div>
                <button type="submit" className="btn btn-primary">Settle Debt</button>
            </form>
        </div>
    );
};

export default SettleDebt;
