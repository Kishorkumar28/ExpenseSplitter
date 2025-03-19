import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Grouplist.css";

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

const GroupList = () => {
    const token = useSelector((state) => state.auth.token);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [inviteUserIds, setInviteUserIds] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null); // ✅ WebSocket state

    // ✅ Get the logged-in user ID
    const decodedToken = token ? decodeToken(token) : null;
    const userId = decodedToken?.nameid; // ✅ Extract user ID from token

    useEffect(() => {
        if (token) {
            fetchJoinedGroups();
            fetchInvitations();
            setupWebSocket(); // ✅ Setup WebSocket for real-time updates
        }
    }, [token]);

    const fetchJoinedGroups = async () => {
        try {
            const response = await axios.get("http://localhost:5293/api/groups", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJoinedGroups(response.data);
        } catch (error) {
            setError("Failed to load joined groups.");
        }
    };

    const fetchInvitations = async () => {
        try {
            const response = await axios.get("http://localhost:5293/api/groups/invitations", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInvitations(response.data);
        } catch (error) {
            setError("Failed to load invitations.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ WebSocket setup for real-time invitations
    const setupWebSocket = () => {
        const ws = new WebSocket("ws://localhost:5293/ws");

        ws.onopen = () => {
            console.log("✅ WebSocket Connected");
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log("📢 WebSocket Message Received:", event.data);

            if (event.data.startsWith("new_invitation:")) {
                const parts = event.data.split(":");
                const recipientId = parts[1];  // ✅ Extract recipient user ID
                const groupName = parts.length > 2 ? parts[2] : "a new group";  // ✅ Extract group name if available

                // ✅ Only show toast if the logged-in user is the recipient
                if (recipientId === userId) {
                    fetchInvitations(); // ✅ Refresh invitations
                    toast.info(`📩 You received an invitation to join ${groupName}!`);
                }
            }
        };

        ws.onclose = () => {
            console.log("⚠️ WebSocket Disconnected. Reconnecting in 3s...");
            setTimeout(setupWebSocket, 3000);
        };
    };

    const handleAcceptInvitation = async (inviteId) => {
        try {
            await axios.post(`http://localhost:5293/api/groups/accept/${inviteId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("🎉 Successfully joined the group!");
            fetchJoinedGroups();
            fetchInvitations();
        } catch (error) {
            toast.error("❌ Failed to accept invitation.");
        }
    };

    const handleRejectInvitation = async (inviteId) => {
        try {
            await axios.post(`http://localhost:5293/api/groups/reject/${inviteId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("❌ Invitation rejected.");
            fetchInvitations();
        } catch (error) {
            toast.error("⚠️ Failed to reject invitation.");
        }
    };

    const handleInviteUser = async (groupId) => {
        const userIdToInvite = inviteUserIds[groupId];
        if (!userIdToInvite) {
            toast.error("⚠️ Please enter a user ID to invite.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5293/api/groups/${groupId}/invite`,
                { invitedUserId: userIdToInvite },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("🎉 User invited successfully!");
            setInviteUserIds((prev) => ({ ...prev, [groupId]: "" }));

            // ✅ Notify recipient via WebSocket
            if (socket) {
                socket.send(`new_invitation:${userIdToInvite}`);
            }
        } catch (error) {
            toast.error("❌ Failed to invite user.");
        }
    };

    return (
        <div className="container">
            <div className="groups-layout">
                {/* ✅ Left Column: My Joined Groups */}
                <div className="joined-groups">
                    <h1 id="my-joined-text">My Joined Groups</h1>
                    {!loading && joinedGroups.map((group) => (
                        <div key={group.groupId} className="list-group-item group-container">
                        {/* ✅ Clicking anywhere in this div will navigate */}
                        <Link to={`/groups/${group.groupId}/expenses`} className="group-clickable">
                            <div className="group-details">
                                <span title={group.name}>
                                    {group.name.length > 25 ? `${group.name.substring(0, 25)}...` : group.name}
                                </span>
                            </div>
                        </Link>
                    
                        {/* ✅ Invite section remains interactive */}
                        <div className="invite-section">
                            <input
                                type="text"
                                placeholder="User ID"
                                value={inviteUserIds[group.groupId] || ""}
                                onChange={(e) => setInviteUserIds((prev) => ({
                                    ...prev, [group.groupId]: e.target.value
                                }))}
                                onClick={(e) => e.stopPropagation()} // ✅ Prevents navigation when clicking inside input
                            />
                            <button onClick={(e) => {
                                e.stopPropagation(); // ✅ Prevents clicking the button from navigating
                                handleInviteUser(group.groupId);
                            }}>Invite</button>
                        </div>
                    </div>
                    
                    
                    ))}
                </div>
    
                {/* ✅ Right Column: Group Invitations */}
                <div className="group-invitations">
                    <h1>Group Invitations</h1>
                    {invitations.length > 0 ? (
                        <div className="group-invitation-container">
                            {invitations.map((invite) => (
                                <div key={invite.inviteId} className="list-group-item d-flex justify-content-between align-items-center user-groups-join">
                                    <span title={invite.groupName}>{invite.groupName}</span>
                                    <div className="accept-reject-div">
                                        <button className="accept-reject-button" onClick={() => handleAcceptInvitation(invite.inviteId)}>
                                            Accept
                                        </button>
                                        <button className="accept-reject-button" onClick={() => handleRejectInvitation(invite.inviteId)}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No invitations available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupList;
