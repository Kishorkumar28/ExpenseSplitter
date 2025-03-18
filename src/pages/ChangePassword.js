import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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
        <div className="container mt-4">
            <h3>Change Password</h3>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label>Current Password:</label>
                            <Field type="password" name="currentPassword" className="form-control" />
                            <ErrorMessage name="currentPassword" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label>New Password:</label>
                            <Field type="password" name="newPassword" className="form-control" />
                            <ErrorMessage name="newPassword" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password:</label>
                            <Field type="password" name="confirmPassword" className="form-control" />
                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Change Password"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;
