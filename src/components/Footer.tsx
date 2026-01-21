export default function Footer() {
    return (
        <footer className="bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-2">Góp ý</h4>
                    <p>bla bla bla</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Hotline</h4>
                    <p>090xxxxxxx</p>
                    <p>abc@gmail.com</p>
                    <p>TP.HCM</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Chính sách</h4>
                    <p>Mua hàng</p>
                    <p>Đổi trả</p>
                    <p>Vận chuyển</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Kết nối</h4>
                    <div className="flex gap-4 items-center">
                        {/* Facebook */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                alt="Facebook"
                                className="size-15"
                            />
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                                alt="Instagram"
                                className="size-15"
                            />
                        </a>

                        {/* Zalo */}
                        <a
                            href="https://zalo.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/906/906377.png"
                                alt="Zalo"
                                className="size-15"
                            />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    )
}