import axios from "axios";

export const api = axios.create({
    baseURL: "https://api-eyewear.purintech.id.vn/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.hal+json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);