import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


const Login = () => {
    
        const [formData, setFormData] = useState({
            email: "",
            password: "",
        });
    
        const navigate = useNavigate();
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
    
        const { email, password } = formData;
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            if (!email || !password) {
                toast.warning("All fields are required!");
            } else {
                try {
                    const res = await axios.post("http://localhost:8000/api/v1/auth/login/", formData);

                    const response = res.data;
    
                    if (res.status === 200) {
                        localStorage.setItem("access", JSON.stringify(res.data.access));
                        localStorage.setItem("refresh", JSON.stringify(res.data.refresh));
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        toast.success(response.message);
                        navigate("/homepage");
                    }
                } catch (error) {
                    toast.error("Invalid credentials!");
                }
            }
        };
    
        return (

            <div className="container">

                <div className="user_forms-login">
                    <h2 className="forms_title">Login</h2>
                    <form className="forms_form" onSubmit={handleSubmit}>
                        <div className="forms_field">
                            <label className="label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="forms_field-input"
                            />
                        </div>

                        <div className="forms_field">
                            <label className="label">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className="forms_field-input"
                            />
                        </div>
                        
                        <div className="forms_buttons">
                            <button type="submit" className="forms_buttons-action">
                                Login
                            </button>
                        </div>

                        <div className="forgot_password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </form>
            
                </div>

            </div>
            
        );
}

export default Login;