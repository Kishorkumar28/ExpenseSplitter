import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Groupform.css";

const GroupForm = () => {
    const token = useSelector((state) => state.auth.token);
    const [groupName, setGroupName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            toast.warn("⚠️ Please enter a valid group name.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5293/api/groups",
                { name: groupName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Group created successfully!");
            setGroupName("");

            // ✅ Delay page refresh to allow toast to be visible
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2 seconds delay
        } catch (error) {
            console.error("❌ Error creating group:", error);
            toast.error(error.response?.data?.message || "❌ Failed to create group.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3 group-form ">
            <div className="mb-2 group-input">
                <h2>Group Name</h2>
                <input
                    type="text"
                    className="form-control input-field"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary group-button">Create Group</button>
        </form>
    );
};

export default GroupForm;
