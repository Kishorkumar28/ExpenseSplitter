import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../components/axiosInstance"; // ✅ Uses axios instance
import GroupForm from "../components/groups/GroupForm";
import GroupList from "../components/groups/GroupList";
import "../components/styles/Group.css"
const Groups = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [groups, setGroups] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchGroups();
        }
    }, [token, navigate]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get("/groups");
            if (Array.isArray(response.data)) {
                setGroups(response.data); // ✅ Now correctly sets array
            } else if (response.data?.$values) {
                setGroups(response.data.$values); // ✅ Handles incorrect API format
            } else {
                setGroups([]);
            }
        } catch (error) {
            console.error("Error fetching groups:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Groups section</h1>
            <GroupForm onGroupCreated={fetchGroups} />
            {loading ? <p>Loading groups...</p> : <GroupList groups={groups} refreshGroups={fetchGroups} />}
        </div>
    );
};

export default Groups;
