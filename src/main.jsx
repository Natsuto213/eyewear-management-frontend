import React from "react";
import ReactDOM from "react-dom/client";
import PageRoute from "@/PageRoute.jsx";
import { BrowserRouter } from "react-router-dom";
import ChatbotWidget from "./components/ChatbotWidget";

const sessionActive = sessionStorage.getItem("session_active");
if (!sessionActive) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <PageRoute />
        <ChatbotWidget />
    </BrowserRouter>
);