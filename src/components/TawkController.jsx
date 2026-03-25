import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TawkController() {
    const location = useLocation();

    useEffect(() => {
        const handleTawkVisibility = () => {
            // Đảm bảo Tawk_API đã được load vào window
            if (window.Tawk_API) {
                const currentPath = location.pathname;

                // 1. Danh sách các trang ĐƯỢC PHÉP HIỆN chat
                // Bạn có thể thêm '/cart', '/checkout' tùy ý nhé
                const isHomePage = currentPath === '/';
                const isAllProductPage = currentPath.startsWith('/all-product/');
                const isProductDetailPage = currentPath.startsWith('/product/');

                // Kiểm tra xem đang ở trang cho phép không
                const isAllowed = isHomePage || isAllProductPage || isProductDetailPage;

                // 2. Gọi lệnh của Tawk.to để Hiện/Ẩn
                if (isAllowed) {
                    // Nếu đang bị ẩn thì hiện lên
                    if (typeof window.Tawk_API.showWidget === 'function') {
                        window.Tawk_API.showWidget();
                    }
                } else {
                    // Ẩn đi khi vào Dashboard hoặc các trang khác
                    if (typeof window.Tawk_API.hideWidget === 'function') {
                        window.Tawk_API.hideWidget();
                    }
                }
            }
        };

        // Gọi hàm kiểm tra mỗi khi chuyển trang
        handleTawkVisibility();

        // 3. Đề phòng lúc mới F5, Tawk.to load chậm hơn React
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_API.onLoad = function() {
            handleTawkVisibility();
        };

    }, [location.pathname]); // Hook này chạy lại mỗi khi URL thay đổi

    return null; // Component này tàng hình, chỉ làm nhiệm vụ chạy ngầm
}