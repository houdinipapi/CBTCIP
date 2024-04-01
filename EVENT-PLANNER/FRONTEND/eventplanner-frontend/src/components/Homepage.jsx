import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/AxiosInstance";


const HomePage = () => {

    const jwt_access = localStorage.getItem("token");

    const navigate = useNavigate();

    const user = localStorage.getItem("user") || "";

    useEffect(() => {
        if (jwt_access === null && !user) {
            navigate("/login");
        } else {
            getSomeData();
        }
    }, [jwt_access, user]);

    // const refresh = localStorage.getItem("refresh") || "";

    const refresh = JSON.parse(localStorage.getItem("refresh"))

    const getSomeData = async () => {
        console.log("Getting some data...");

        const res = await axiosInstance.get("/auth/test-auth/");

        if (res.status === 200) {
            console.log(res.data);
        }
    };


    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post("/auth/logout/", { "refresh_token": refresh });

            if (res.status === 200) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                
                navigate("/login");

                toast.warn(res.data.message);
            }
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Error logging out!");
        }
    }

    return (
        <div className="container-fluid main">

            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span> 
                        </button>
                        <a className="navbar-brand" href="#">Website</a>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div id="myCarousel" className="carousel carousel-fade slide" data-ride="carousel" data-interval="3000">
                <div className="carousel-inner" role="listbox">
                    <div className="item active background a"></div>
                    <div className="item background b"></div>
                    <div className="item background c"></div>
                </div>
            </div>
  
            <div className="covertext">
                <div className="col-lg-10" style={{ float: "none", margin: "0 auto" }}>
                    <h1 className="title">ELINE</h1>
                    <h3 className="subtitle">A Tidy, Clean, Easy-to-Use, and Responsive Landing Page Template</h3>
                </div>
                <div className="col-xs-12 explore">
                    <button
                        type="button"
                        className="btn btn-lg explorebtn"
                        onClick={handleLogout}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
  
        </div>
    )

}

export default HomePage;