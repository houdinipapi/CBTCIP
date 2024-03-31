import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const EmalVerification = () => {

    const [otp, setOtp] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.warning("OTP is required!");
        } else {
            try {
                const res = await axios.post("http://localhost:8000/api/v1/auth/verify-email/", { otp: otp });

                if (res.status === 200) {
                    toast.success(res.data.message);
                    navigate("/login");
                }
            } catch (error) {
                toast.error("Invalid OTP!");
            }
        }
    };


    return (
        <div className="user_forms-signup"> {/* Apply container class */}
            <h2 className="forms_title">Email Verification</h2> {/* Apply forms_title class */}
            <form className="forms_form" onSubmit={handleSubmit}> {/* Apply forms_form class */}
                <div className="forms_field"> {/* Apply forms_field class */}
                    <label>OTP Code:</label>
                    <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="forms_field-input" /> {/* Apply forms_field-input class */}
                </div>
                <div className="forms_buttons"> {/* Apply forms_buttons class */}
                    <button type="submit" className="forms_buttons-action">Verify Email</button> {/* Apply forms_buttons-action class */}
                </div>
            </form>
        </div>
    );
};

export default EmalVerification;