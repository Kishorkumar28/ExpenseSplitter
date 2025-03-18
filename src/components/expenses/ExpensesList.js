import React from "react";

const ExpenseList = ({ expenses }) => {
    return (
        <div>
            <h4>Group Expenses</h4>
            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                <ul className="list-group">
                    {expenses.map((expense) => (
                        <li key={expense.id} className="list-group-item">
                            {expense.description} - ₹{expense.amount} (Paid by: {expense.paidByUsername})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ExpenseList;
