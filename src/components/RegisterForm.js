import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../components/services/authService"; // ✅ Import API function
import { toast } from "react-toastify"; // ✅ Import Toastify

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
            setTimeout(() => navigate("/login"), 2000); // ✅ Redirect after 2s for toast display
        } catch (error) {
            toast.error("❌ Registration failed: " + (error.response?.data?.message || "Server error"));
        }
        setSubmitting(false);
    };

    return (
        <div className="container mt-5">
            <h2>📝 Register</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label>Name:</label>
                            <Field type="text" name="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                        </div>
                        <div className="mb-3">
                            <label>Email:</label>
                            <Field type="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                        </div>
                        <div className="mb-3">
                            <label>Password:</label>
                            <Field type="password" name="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterForm;
