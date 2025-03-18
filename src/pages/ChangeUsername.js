import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ChangeUsername = () => {
    const token = useSelector(state => state.auth.token);

    const initialValues = { newUsername: "" };

    const validationSchema = Yup.object({
        newUsername: Yup.string().min(3, "⚠️ Must be at least 3 characters").required("⚠️ Username is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post(
                "http://localhost:5293/api/auth/change-username",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Username updated successfully!");
        } catch (error) {
            toast.error("❌ " + (error.response?.data?.message || "Username change failed"));
        }
        setSubmitting(false);
    };

    return (
        <div className="container mt-4">
            <h3>Change Username</h3>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label>New Username:</label>
                            <Field type="text" name="newUsername" className="form-control" />
                            <ErrorMessage name="newUsername" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Change Username"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangeUsername;
