import Navbar from "../components/navbar";
import BannerSale from "../components/BannerSale";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";


export default function HomePage() {
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
