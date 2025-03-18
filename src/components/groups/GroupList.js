import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const GroupList = () => {
    const token = useSelector((state) => state.auth.token);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token) {
            fetchJoinedGroups();
            fetchAvailableGroups();
        }
    }, [token]);

    // ✅ Fetch joined groups
    const fetchJoinedGroups = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5293/api/groups",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setJoinedGroups(response.data);
        } catch (error) {
            console.error("❌ Error fetching joined groups:", error);
            setError("Failed to load joined groups.");
        }
    };

    // ✅ Fetch all available groups
    const fetchAvailableGroups = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5293/api/groups/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // ✅ Exclude groups the user has already joined
            const filteredGroups = response.data.filter(
                (group) => !joinedGroups.some((jg) => jg.groupId === group.groupId)
            );

            setAvailableGroups(filteredGroups);
        } catch (error) {
            console.error("❌ Error fetching available groups:", error);
            setError("Failed to load available groups.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Join a Group Function
    const handleJoinGroup = async (groupId) => {
        try {
            await axios.post(
                `http://localhost:5293/api/groups/join/${groupId}`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎉 Successfully joined the group!");
            fetchJoinedGroups(); // ✅ Refresh joined groups list
            fetchAvailableGroups(); // ✅ Refresh available groups list
        } catch (error) {
            console.error("❌ Error joining group:", error);
            alert(error.response?.data?.message || "Failed to join the group.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>My Joined Groups</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading groups...</p> : null}

            {/* ✅ Display Joined Groups */}
            {!loading && joinedGroups.length === 0 && <p>No joined groups yet.</p>}
            {!loading && joinedGroups.length > 0 && (
                <ul className="list-group mb-4">
                    {joinedGroups.map((group) => (
                        <li key={group.groupId} className="list-group-item">
                            <Link to={`/groups/${group.groupId}/expenses`} className="text-decoration-none">
                                {group.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* ✅ Display Available Groups to Join */}
            <h3>Available Groups to Join</h3>
            {availableGroups.length === 0 && <p>No available groups to join.</p>}
            {availableGroups.length > 0 && (
                <ul className="list-group">
                    {availableGroups.map((group) => (
                        <li key={group.groupId} className="list-group-item d-flex justify-content-between align-items-center">
                            {group.name}
                            <button className="btn btn-sm btn-primary" onClick={() => handleJoinGroup(group.groupId)}>
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupList;
