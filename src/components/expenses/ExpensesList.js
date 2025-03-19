import React from "react";

const ExpenseList = ({ expenses }) => {
    if (!Array.isArray(expenses)) {
        return <p>Loading expenses...</p>; // ✅ Handles cases where expenses is not an array
    }

    return (
        <div className="all-expenses">
            <h1>All Expenses</h1>
            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                <div className="list-group expense-list">
                    {expenses.map((expense, index) => (
                        <div key={expense.id} className="list-group-item">
                            <strong>{index + 1}. </strong>
                            {expense.description} - ₹{expense.amount} (Paid by: {expense.paidByUsername})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



export default ExpenseList;
