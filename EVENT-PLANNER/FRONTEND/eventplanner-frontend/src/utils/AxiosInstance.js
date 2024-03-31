import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";



const token = localStorage.getItem("access") ? JSON.parse(localStorage.getItem("access")) : "";

const refresh_token = localStorage.getItem("refresh") ? JSON.parse(localStorage.getItem("refresh")) : "";

const baseURL = "http://localhost:8000/api/v1/";

const axiosInstance = axios.create({
    baseURL: baseURL,
    "Content-type": "application/json",
    headers: {
        "Authorization": localStorage.getItem("access") ? `Bearer ${token}` : ""
    },
});

axiosInstance.interceptors.request.use(async req => {
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
        const user = jwtDecode(token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        // console.log(isExpired)
        if (isExpired) {
            try {
                const res = await axios.post(`${baseURL}auth/token/refresh/`, { refresh: refresh_token });

                console.log(res.data);

                if (res.status === 200) {
                    localStorage.setItem("access", JSON.stringify(res.data.access));
                    req.headers.Authorization = `Bearer ${res.data.access}`;
                    return req;
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                const res = await axios.post(`${baseURL}auth/logout/`, { refresh_token: refresh_token });
                if (res.status === 200) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("user");
                }
            }
        }
    }
    return req;
})


export default axiosInstance;