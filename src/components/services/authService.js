import axios from "axios";

const API_URL = "http://localhost:5293/api/auth";

export const registerUser = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        const token = response.data.token;
        localStorage.setItem("token", token); // ✅ Store JWT token
        return token;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token"); // ✅ Clear token on logout
};
