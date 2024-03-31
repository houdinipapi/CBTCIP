import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Register = () => {

    const navigate = useNavigate();

    // State for storing signup form data
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // State for storing error messages
    const [errors, setErrors] = useState({});

    // Function to handle input changes in the form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { firstname, lastname, email, password, confirmPassword } = formData;

    // Function to submit the form and signup the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            setErrors({ ...errors, all: "All fields are required" });
            return;
        } else if (password !== confirmPassword) {
            setErrors({ ...errors, password: "Passwords do not match" });
            return;
        } else {
            try {
                // Make call to the backend to signup the user
                const res = await axios.post("http://localhost:8000/api/v1/auth/register/", formData);

                const response = res.data

                // Check the response
                if (res.status === 201) {
                    // Redirect to the Email Verification component
                    navigate("/otp/verify");
                    toast.success(response.message);
                }
            } catch (error) {
                // Handle the error here
                console.error(error);
            }
        }
        
    // const send_code_to_backend = async (e) => {}

    };

    return (
        <div className="user_forms-signup">
            <h2 className="forms_title">Sign Up</h2>
            <form className="forms_form" onSubmit={handleSubmit}>
                <fieldset className="forms_fieldset">
                    <div className="forms_field">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            className="forms_field-input" 
                            name="firstname" 
                            value={firstname} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="forms_field">
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            className="forms_field-input" 
                            name="lastname" 
                            value={lastname} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="forms_field">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="forms_field-input" 
                            name="email" 
                            value={email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="forms_field">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="forms_field-input" 
                            name="password" 
                            value={password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="forms_field">
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="forms_field-input" 
                            name="confirmPassword" 
                            value={confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </fieldset>
                <div className="forms_buttons">
                    <input type="submit" value="Sign up" className="forms_buttons-action" />
                </div>
            </form>
        </div>
    );
}

export default Register;