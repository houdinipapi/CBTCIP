import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Register = () => {

    const navigate = useNavigate();

    // State for storing signup form data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    // console.log("Working!")

    // State for storing error messages
    const [errors, setErrors] = useState({});

    // console.log("Working!")

    // Function to handle input changes in the form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // console.log("Working!")

    const { first_name, last_name, email, password, confirm_password } = formData;

    // Function to submit the form and signup the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!first_name || !last_name || !email || !password || !confirm_password) {

            console.log("All fields are required")
            setErrors({ ...errors, all: "All fields are required" });
            
        } else if (password !== confirm_password) {
            console.log("Passwords do not match!");
            toast.warning("Passwords do not match!");
            setErrors({ ...errors, password: "Passwords do not match" });
        } else {

            console.log(formData);

            try {
                // Make call to the backend to signup the user
                const res = await axios.post("http://localhost:8000/api/v1/auth/register/", formData)

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
        <div  className="container">
            <div className="user_forms-signup">
            <h2 className="forms_title">Sign Up</h2>
            <form className="forms_form" onSubmit={handleSubmit}>
                <fieldset className="forms_fieldset">
                    <div className="forms_field">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            className="forms_field-input" 
                            name="first_name" 
                            value={first_name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="forms_field">
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            className="forms_field-input" 
                            name="last_name" 
                            value={last_name} 
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
                            name="confirm_password" 
                            value={confirm_password} 
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
        </div>
        
    );
}

export default Register;