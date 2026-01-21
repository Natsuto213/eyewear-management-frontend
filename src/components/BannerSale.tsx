export default function BannerSale() {
    return (
        <section
            className="h-[400px] bg-cover bg-center flex items-center text-white"
            style={{
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1587614382346-ac6cdbb4c2c1)",
            }}
        >
            <div className="w-full text-center bg-black/40 py-10">
                <h1 className="text-3xl font-light">CHƯƠNG TRÌNH SALE</h1>
                <h2 className="text-5xl font-bold my-2">THE TITAN2</h2>
                <p className="tracking-widest">ANNA EYEGLASSES</p>
                <button className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded">
                    MUA NGAY
                </button>
            </div>
        </section>
    );
}