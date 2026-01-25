import { Link } from "react-router-dom";

export default function PurchasePolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black font-['Inter'] space-y-6">
      
      <h1 className="text-3xl font-bold uppercase">
        Chính sách mua hàng
      </h1>

      <p className="text-lg">
        Chính sách này áp dụng cho tất cả khách hàng mua sắm trên hệ thống
        bán kính mắt trực tuyến.
      </p>

      {/* 1. Hình thức mua hàng */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Hình thức mua hàng</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Mua sản phẩm có sẵn.</li>
          <li>Đặt trước (pre-order).</li>
          <li>Làm kính theo đơn prescription.</li>
        </ul>
      </section>

      {/* 2. Đặt hàng & thanh toán */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Đặt hàng & thanh toán</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Khách hàng lựa chọn sản phẩm/dịch vụ và xác nhận đơn hàng trên hệ thống.</li>
          <li>
            Đơn pre-order và đơn prescription yêu cầu thanh toán trước
            <span className="font-semibold"> 30% </span>
            giá trị đơn hàng.
          </li>
          <li>
            Phần còn lại được thanh toán trước khi giao hàng hoặc khi nhận hàng
            theo thỏa thuận.
          </li>
          <li>
            Giá bán, phí và khuyến mãi được hiển thị rõ tại thời điểm thanh toán.
          </li>
        </ul>
      </section>

      {/* 3. Xử lý đơn hàng */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Xử lý đơn hàng</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>
            Đơn hàng chỉ được xử lý sau khi xác nhận thanh toán
            (hoặc đặt cọc 30%).
          </li>
          <li>
            Thời gian xử lý:
            <ul className="list-disc pl-6 mt-1">
              <li>Đơn có sẵn: 1–3 ngày làm việc.</li>
              <li>Pre-order & prescription: theo thời gian thông báo cụ thể.</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* 4. Giao hàng */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Giao hàng</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Giao hàng theo khu vực được hỗ trợ.</li>
          <li>Khách hàng có trách nhiệm kiểm tra sản phẩm khi nhận hàng.</li>
        </ul>
      </section>

      {/* 5. Điều khoản chung */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Điều khoản chung</h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>
            Khách hàng chịu trách nhiệm về thông tin cung cấp,
            đặc biệt là đơn prescription.
          </li>
          <li>
            Hệ thống có quyền từ chối hoặc hủy đơn hàng trong trường hợp bất khả kháng
            và hoàn tiền theo quy định.
          </li>
        </ul>
      </section>

      {/* LINKS ROUTER */}
      <div className="pt-8 flex flex-wrap gap-6">
        <Link
          to="/chinh-sach-doi-tra"
          className="inline-block text-cyan-600 font-semibold hover:underline"
        >
          Chính sách đổi trả 
        </Link>
        
        <Link
          to="/bao-hanh"
          className="text-cyan-600 font-semibold hover:underline"
        >
          → Xem Chính sách bảo hành
        </Link>

        <Link
          to="/contact"
          className="text-cyan-600 font-semibold hover:underline"
        >
          → Liên hệ hỗ trợ khách hàng
        </Link>
      </div>

    </div>
  );
}
