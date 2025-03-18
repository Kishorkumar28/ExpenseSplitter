import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../components/services/authService"; // ✅ Import API function

const RegisterForm = () => {
    const navigate = useNavigate();

    const initialValues = { name: "", email: "", password: "" };
    const validationSchema = Yup.object({
        name: Yup.string().min(2, "Too short").required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await registerUser(values.name, values.email, values.password); // ✅ Call authService.js
            navigate("/login");
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.message || "Server error"));
        }
        setSubmitting(false);
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label>Name:</label>
                            <Field type="text" name="name" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label>Email:</label>
                            <Field type="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label>Password:</label>
                            <Field type="password" name="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterForm;
