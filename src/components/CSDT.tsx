import { Link } from "react-router-dom";

export default function ReturnPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black font-['Inter'] space-y-6">
      
      <h1 className="text-3xl font-bold uppercase">
        Chính sách đổi trả
      </h1>

      {/* 1. Điều kiện đổi trả */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          1. Điều kiện đổi trả
        </h2>
        <p className="text-lg">
          Khách hàng được đổi hoặc trả sản phẩm trong các trường hợp sau:
        </p>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.</li>
          <li>Giao sai sản phẩm, sai mẫu mã so với đơn hàng.</li>
        </ul>
      </section>

      {/* 2. Thời gian đổi trả */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          2. Thời gian đổi trả
        </h2>
        <p className="text-lg">
          Yêu cầu đổi trả phải được gửi trong vòng
          <span className="font-semibold"> 7 ngày </span>
          kể từ ngày khách hàng nhận hàng.
        </p>
      </section>

      {/* 3. Trường hợp không áp dụng */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          3. Trường hợp không áp dụng
        </h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Sản phẩm đã qua sử dụng, trầy xước do người dùng.</li>
          <li>
            Tròng kính gia công theo đơn thuốc
            <span className="italic"> (trừ lỗi kỹ thuật)</span>.
          </li>
          <li>
            Sản phẩm hư hỏng do va đập hoặc bảo quản không đúng cách.
          </li>
        </ul>
      </section>

      {/* 4. Quy trình đổi trả */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          4. Quy trình đổi trả
        </h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>Khách hàng liên hệ bộ phận hỗ trợ và cung cấp thông tin đơn hàng.</li>
          <li>Hệ thống kiểm tra và xác nhận điều kiện đổi trả.</li>
          <li>Thực hiện đổi sản phẩm hoặc hoàn tiền theo quy định.</li>
        </ul>
      </section>

      {/* 5. Hoàn tiền */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          5. Hoàn tiền
        </h2>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li>
            Hoàn tiền theo phương thức thanh toán ban đầu
            (Momo / Tiền mặt).
          </li>
          <li>
            Thời gian hoàn tiền:
            <span className="font-semibold"> 2–3 ngày làm việc </span>
            sau khi xác nhận.
          </li>
        </ul>
      </section>

      {/* LINKS ROUTER */}
      <div className="pt-8 flex flex-wrap gap-6">
        <Link
          to="/chinh-sach-mua-hang"
          className="text-cyan-600 font-semibold hover:underline"
        >
          → Chính sách mua hàng
        </Link>

        <Link
          to="/bao-hanh"
          className="text-cyan-600 font-semibold hover:underline"
        >
          → Chính sách bảo hành
        </Link>
      </div>

    </div>
  );
}
