import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Grouplist.css";
const GroupList = () => {
    const token = useSelector((state) => state.auth.token);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token) {
            fetchJoinedGroups();
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
            fetchAvailableGroups(response.data); // ✅ Fetch available groups AFTER joined groups update
        } catch (error) {
            console.error("❌ Error fetching joined groups:", error);
            setError("Failed to load joined groups.");
        }
    };

    // ✅ Fetch available groups excluding joined ones
    const fetchAvailableGroups = async (joinedGroupsList) => {
        try {
            const response = await axios.get(
                "http://localhost:5293/api/groups/all",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAvailableGroups(response.data);
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

            toast.success("🎉 Successfully joined the group!");

            // ✅ Refresh both lists after joining
            fetchJoinedGroups();
        } catch (error) {
            console.error("❌ Error joining group:", error);
            toast.error(error.response?.data?.message || "Failed to join the group.");
        }
    };

    return (
        <div className="container">
            <h2 id="my-joined-groups-text">My Joined Groups</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading groups...</p> : null}

            {/* ✅ Display Joined Groups */}
{!loading && joinedGroups.length > 0 && (
    <div className="list-group user-group">
        {joinedGroups.map((group) => (
            <div key={group.groupId} className="list-group-item user-groups">
                <Link to={`/groups/${group.groupId}/expenses`} className="">
                    {group.name.length > 20 ? `${group.name.substring(0, 20)}...` : group.name}
                </Link>
            </div>
        ))}
    </div>
)}

{/* ✅ Display Available Groups to Join */}
<h2 id="groups-to-join-text">Available Groups to Join</h2>
{availableGroups.length > 0 && (
    <div className="list-group user-group-join">
        {availableGroups.map((group) => {
            const isJoined = joinedGroups.some(jg => jg.groupId === group.groupId);
            return (
                <div key={group.groupId} className="list-group-item d-flex justify-content-between align-items-center user-groups-join">
                    {/* ✅ Truncate Group Name */}
                    <span title={group.name}>
                        {group.name.length > 20 ? `${group.name.substring(0, 12)}...` : group.name}
                    </span>
                    {isJoined ? (
                        <button className="btn btn-sm btn-secondary join-group-btn" disabled>
                            Joined
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-primary join-group-btn" onClick={() => handleJoinGroup(group.groupId)}>
                            Join
                        </button>
                    )}
                </div>
            );
        })}
    </div>
)}

        </div>
    );
};

export default GroupList;
