/**
 * LoadingState.jsx
 * =================
 * Hiển thị màn hình loading (đang tải) khi đang fetch dữ liệu sản phẩm.
 * Đơn giản, dễ hiểu: spinner teal + chữ "Đang tải...".
 */

export default function LoadingState() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      {/* Spinner xoay tròn */}
      <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      {/* Chữ thông báo */}
      <p className="text-teal-700 font-semibold tracking-widest uppercase text-sm">
        Đang tải sản phẩm...
      </p>
    </div>
  );
}
