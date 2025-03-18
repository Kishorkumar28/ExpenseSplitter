import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const GroupForm = ({ onGroupCreated }) => {
    const token = useSelector((state) => state.auth.token);
    const [groupName, setGroupName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName) {
            alert("Please enter a group name");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5293/api/groups",
                { name: groupName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGroupName("");
            onGroupCreated(); // Refresh group list
        } catch (error) {
            console.error("❌ Error creating group:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-2">
                <label>Group Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Create Group</button>
        </form>
    );
};

export default GroupForm;
