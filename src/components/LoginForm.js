import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "../components/styles/LoginForm.css";  

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = { email: "", password: "" };

    // ✅ Enhanced Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("⚠️ Invalid email format")
            .required("⚠️ Email is required"),
        password: Yup.string()
            .min(6, "⚠️ Password must be at least 6 characters")
            .matches(/[A-Z]/, "⚠️ Must contain at least one uppercase letter")
            .matches(/[a-z]/, "⚠️ Must contain at least one lowercase letter")
            .matches(/[0-9]/, "⚠️ Must contain at least one number")
            .required("⚠️ Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post("http://localhost:5293/api/auth/login", values);
            dispatch(loginSuccess(response.data));
            toast.success("✅ Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (error) {
            toast.error("❌ Login failed: " + (error.response?.data?.message || "Invalid credentials"));
        }
        setSubmitting(false);
    };

    return (
        <div className="login-container"> 
            <div className="animated-bg"></div> 
            <div className="login-card">
                <h2 className="login-title">🔑 Welcome Back!</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form className="login-form">
                            
                            <div className="">
                                <label>Email:</label>
                                <Field type="email" name="email" className="form-control login-input" />
                                <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                            </div>

                            
                            <div className="">
                                <label>Password:</label>
                                <Field type="password" name="password" className="form-control login-input" />
                                <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                            </div>

                            
                            <button type="submit" className="btn login-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>

                            
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginForm;
