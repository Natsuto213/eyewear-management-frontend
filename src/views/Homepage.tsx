import BannerSale from "../components/BannerSale";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import ProductSection from "../components/ProductSection";

export default function Homepage() {
    return (
        <>
            <Navbar />
            <BannerSale />
            <ProductSection title={"Best Seller"} />
            <ProductSection title={"New Arrival "} />
            <Footer />
        </>
    )
}
