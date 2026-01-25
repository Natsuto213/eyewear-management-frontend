import { Link } from "react-router-dom";

export default function WarrantyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black font-['Inter'] space-y-6">
      
      <h1 className="text-3xl font-bold uppercase">
        Chính sách bảo hành
      </h1>

      {/* 1. Phạm vi bảo hành */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Phạm vi bảo hành</h2>
        <p className="text-lg">
          Áp dụng cho các sản phẩm mua trên hệ thống bán kính mắt trực tuyến,
          bao gồm gọng kính và tròng kính.
        </p>
      </section>

      {/* 2. Thời gian bảo hành */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Thời gian bảo hành</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Thời gian bảo hành được áp dụng theo thông tin công bố cho từng sản phẩm.</li>
          <li>Thời gian bảo hành được tính từ ngày khách hàng nhận hàng.</li>
        </ul>
      </section>

      {/* 3. Điều kiện bảo hành */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Điều kiện bảo hành</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Lỗi kỹ thuật do nhà sản xuất.</li>
          <li>Lỗi gia công tròng kính (đối với đơn prescription).</li>
        </ul>
      </section>

      {/* 4. Trường hợp không bảo hành */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Trường hợp không bảo hành</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Hư hỏng do va đập, rơi vỡ, trầy xước trong quá trình sử dụng.</li>
          <li>Sử dụng sai cách hoặc bảo quản không đúng hướng dẫn.</li>
          <li>Hao mòn tự nhiên theo thời gian.</li>
          <li>
            Tròng kính đã gia công theo đơn prescription nhưng sai do thông tin khách hàng cung cấp.
          </li>
        </ul>
      </section>

      {/* 5. Quy trình bảo hành */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Quy trình bảo hành</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Khách hàng liên hệ bộ phận hỗ trợ và cung cấp thông tin đơn hàng.</li>
          <li>Hệ thống kiểm tra và xác nhận điều kiện bảo hành.</li>
          <li>
            Thời gian xử lý bảo hành: <span className="font-semibold">7 ngày làm việc</span>.
          </li>
        </ul>
      </section>

      {/* LINK LIÊN HỆ */}
      <div className="pt-6">
        <Link
          to="/contact"
          className="inline-block text-cyan-600 font-semibold hover:underline"
        >
          Liên hệ bộ phận hỗ trợ bảo hành →
        </Link>

        <Link
          to="/chinh-sach-doi-tra"
          className="inline-block text-cyan-600 font-semibold hover:underline"
        >
          Chính sách đổi trả 
        </Link>

        <Link
          to="/chinh-sach-mua-hang"
          className="text-cyan-600 font-semibold hover:underline"
        >
          → Chính sách mua hàng
        </Link>
      </div>

    </div>
  );
}
