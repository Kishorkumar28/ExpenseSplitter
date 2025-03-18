import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import axios from "axios";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = { email: "", password: "" };
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6).required("Required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post("http://localhost:5293/api/auth/login", values);
            dispatch(loginSuccess(response.data)); // Store token in Redux
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed: " + error.response.data.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
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
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginForm;
