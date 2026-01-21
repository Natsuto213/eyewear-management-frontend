const products = Array.from({ length: 5 });

export default function ProductSection({ title }) {
    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                <select className="border px-3 py-1 rounded">
                    <option>Gọng</option>
                    <option>Tròng</option>
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {products.map((_, i) => (
                    <div
                        key={i}
                        className="border rounded-lg p-3 hover:shadow-lg transition"
                    >
                        <img
                            src="https://via.placeholder.com/200x140"
                            alt=""
                            className="w-full mb-2"
                        />
                        <p className="font-medium">Tên sản phẩm</p>
                        <span className="text-gray-500">1.200.000đ</span>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <button className="border px-5 py-2 rounded hover:bg-gray-100">
                    Xem toàn bộ sản phẩm
                </button>
            </div>
        </section>
    )
}