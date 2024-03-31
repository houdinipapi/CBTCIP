import React, { useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "react-toastify";


const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.warning("Email is required!");
        } else {
            try {
                const res = await axiosInstance.post("/auth/password-reset/", { "email": email });

                if (res.status === 200) {
                    console.log(res.data);
                    toast.success(res.data.message);
                }
                setEmail("")
            } catch (error) {
                console.log(error);
                toast.error("Invalid Email!");
            }
        }
    };

    return (
        <div className="container">

            <div className="user_forms-signup">
                <h2 className="forms_title">Forgot Password</h2>
                <form className="forms_form" onSubmit={handleSubmit}>
                    <div className="forms_field">
                        <label className="label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="forms_field-input"
                        />
                    </div>
                    <div className="forms_buttons">
                        <button type="submit" className="forms_buttons-action">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>

        </div>

    );
};

export default ForgotPassword;