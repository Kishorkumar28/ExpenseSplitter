import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../components/services/authService"; 
import { toast } from "react-toastify"; 
import "../components/styles/RegisterForm.css";  

const RegisterForm = () => {
    const navigate = useNavigate();

    const initialValues = { name: "", email: "", password: "" };

    // ✅ Improved Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, "⚠️ Name must be at least 2 characters")
            .required("⚠️ Name is required"),
        email: Yup.string()
            .email("⚠️ Invalid email format")
            .required("⚠️ Email is required"),
        password: Yup.string()
            .min(6, "⚠️ Password must be at least 6 characters")
            .matches(/[A-Z]/, "⚠️ Must contain at least one uppercase letter")
            .matches(/[a-z]/, "⚠️ Must contain at least one lowercase letter")
            .matches(/[0-9]/, "⚠️ Must contain at least one number")
            .matches(/[@$!%*?&]/, "⚠️ Must contain at least one special character")
            .required("⚠️ Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await registerUser(values.name, values.email, values.password);
            toast.success("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            toast.error("❌ Registration failed: " + (error.response?.data?.message || "Server error"));
        }
        setSubmitting(false);
    };

    return (
        <div className="register-container"> {/* ✅ Apply Flashy UI */}
            <div className="animated-bg"></div> {/* ✅ Animated Background */}
            <div className="register-card">
                <h2 className="register-title">📝 Create Your Account</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form className="register-form">
                            {/* 🌟 Name Input */}
                            <div className="mb-3">
                                <label>Name:</label>
                                <Field type="text" name="name" className="form-control register-input" />
                                <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                            </div>

                            {/* 🌟 Email Input */}
                            <div className="mb-3">
                                <label>Email:</label>
                                <Field type="email" name="email" className="form-control register-input" />
                                <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                            </div>

                            {/* 🌟 Password Input */}
                            <div className="mb-3">
                                <label>Password:</label>
                                <Field type="password" name="password" className="form-control register-input" />
                                <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                            </div>

                            {/* 🔥 Register Button */}
                            <button type="submit" className="btn register-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Sign Up"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RegisterForm;
