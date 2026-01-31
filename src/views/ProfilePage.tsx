import { Navigate, NavLink, Outlet, useMatch } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 
import Profile from "@/components/Profile";

export default function Profilepage() {
    return (
        <>
            <Navbar />
            <Profile />
            <Footer />
        </>
    )
}