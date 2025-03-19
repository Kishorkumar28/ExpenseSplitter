import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../components/styles/ChangePassword.css";
const ChangePassword = () => {
    const token = useSelector(state => state.auth.token);

    const initialValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

    const validationSchema = Yup.object({
        currentPassword: Yup.string().required("⚠️ Current password is required"),
        newPassword: Yup.string()
            .min(6, "⚠️ Must be at least 6 characters")
            .matches(/[A-Z]/, "⚠️ Must contain at least one uppercase letter")
            .matches(/[a-z]/, "⚠️ Must contain at least one lowercase letter")
            .matches(/[0-9]/, "⚠️ Must contain at least one number")
            .matches(/[@$!%*?&]/, "⚠️ Must contain at least one special character")
            .required("⚠️ New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "⚠️ Passwords must match")
            .required("⚠️ Confirm password is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post(
                "http://localhost:5293/api/auth/change-password",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Password updated successfully!");
        } catch (error) {
            toast.error("❌ " + (error.response?.data?.message || "Password change failed"));
        }
        setSubmitting(false);
    };

    return (

        <div className="change-password-outerdiv" >
            <div className="change-password-container">
                        <h1>Change Password</h1>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
                                        <h3>Current Password:</h3>
                                        <Field type="password" name="currentPassword" className="form-control change-password-input" />
                                        <ErrorMessage name="currentPassword" component="div" className="error-message" />
                                    </div>
                                    <div className="mb-3">
                                        <h3>New Password:</h3>
                                        <Field type="password" name="newPassword" className="form-control change-password-input" />
                                        <ErrorMessage name="newPassword" component="div" className="error-message" />
                                        <p className="password-hint">⚠️ Must include at least one uppercase letter, one number, and one special character.</p>
                                    </div>
                                    <div className="mb-3">
                                        <h3>Confirm Password:</h3>
                                        <Field type="password" name="confirmPassword" className="form-control change-password-input" />
                                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                                    </div>
                                    <button type="submit" className="btn change-password-btn" disabled={isSubmitting}>
                                        {isSubmitting ? "Updating..." : "Change Password"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
            </div>
        </div>
        
    );
    
};

export default ChangePassword;
