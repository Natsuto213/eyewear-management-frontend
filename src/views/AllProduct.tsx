import Navbar from '../components/Navbar'
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function AllProduct() {
    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-6">
                <h1 className="text-2xl font-semibold mb-6">Tất cả sản phẩm</h1>
                {/* Nơi hiển thị Frame / Lens / Contact Lens */}
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
