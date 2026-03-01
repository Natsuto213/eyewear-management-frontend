import { useState, createContext, useContext, useEffect, useCallback } from "react";
import {
    addCartItemApi,
    updateCartQtyApi,
    getAllCartApi,
    deleteCartItemApi,
    deleteAllCartApi,
    mapApiItemToLocal,
} from "../api/cartApi";

const ShoppingContext = createContext();

// ═══════════════════════════════════════════════════════════════
// ShoppingContextProvider
// ───────────────────────
// Quản lý giỏ hàng HOÀN TOÀN qua API backend.
//
// ⚙️ Cách hoạt động (rất đơn giản):
//   1. Khi mở trang   → gọi GET /getAllCart → hiển thị lên UI
//   2. Khi thêm/sửa/xóa → gọi API tương ứng → gọi lại GET để cập nhật UI
//   3. Backend tự xử lý logic trùng đơn → Frontend chỉ cần gọi API
//
// 🔒 Kiểm tra đăng nhập:
//   Chỉ check ở hàm addCartItem (khi bấm "Thêm vào giỏ hàng")
//   Nếu chưa đăng nhập → hiện popup yêu cầu đăng nhập
// ═══════════════════════════════════════════════════════════════
export function ShoppingContextProvider({ children }) {

    // ── State chính ──
    const [cartItems, setCartItems] = useState([]);         // Mảng sản phẩm trong giỏ
    const [loading, setLoading] = useState(false);           // Đang gọi API?
    const [showLoginPopup, setShowLoginPopup] = useState(false); // Hiện popup đăng nhập?

    // ══════════════════════════════════════════════════════════════
    // fetchCart — Lấy toàn bộ giỏ hàng từ server
    // ──────────────────────────────────────────────────────────────
    // Gọi GET /api/cart/getAllCart
    // → Server trả về mảng sản phẩm
    // → Chuyển đổi sang format hiển thị (mapApiItemToLocal)
    // → Lưu vào state cartItems
    // ══════════════════════════════════════════════════════════════
    const fetchCart = useCallback(async () => {
        // Chưa đăng nhập → không gọi API (sẽ bị lỗi 401)
        const token = localStorage.getItem("access_token");
        if (!token) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const apiItems = await getAllCartApi();              // Gọi API
            const localItems = apiItems.map(mapApiItemToLocal); // Chuyển đổi format
            setCartItems(localItems);                           // Cập nhật state → UI tự render lại
        } catch (err) {
            console.error("❌ Lỗi tải giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Tự động tải giỏ hàng khi mở trang ──
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // ══════════════════════════════════════════════════════════════
    // addCartItem — Thêm sản phẩm vào giỏ
    // ──────────────────────────────────────────────────────────────
    // 🔒 Kiểm tra đăng nhập:
    //   - Chưa login → hiện popup → dừng lại
    //   - Đã login → gọi API thêm → tải lại giỏ hàng
    //
    // Backend tự xử lý:
    //   - Nếu sản phẩm + đơn thuốc trùng → tăng quantity
    //   - Nếu mới → tạo dòng mới
    // ══════════════════════════════════════════════════════════════
    const addCartItem = async (newItem) => {
        // Bước 1: Kiểm tra đăng nhập
        console.log("Theem vao gio hang", newItem)
        const token = localStorage.getItem("access_token");
        if (!token) {
            setShowLoginPopup(true);  // Hiện popup "Hãy đăng nhập để mua hàng"
            return;                    // Dừng — không thêm gì
        }

        // Bước 2: Gọi API thêm sản phẩm
        try {
            await addCartItemApi(newItem, newItem.quantity);
            await fetchCart();  // Bước 3: Tải lại giỏ hàng để UI cập nhật
            console.log("✅ Thêm vào giỏ thành công:", newItem);
        } catch (err) {
            console.error("❌ Lỗi thêm vào giỏ:", err);
            console.error("❌ Response data:", err.response?.data);
            console.error("❌ Response status:", err.response?.status);
        }
    };

    // ──────────────────────────────────────────────────────────
    // increaseQty — Tăng số lượng 1 đơn vị
    // ──────────────────────────────────────────────────────────
    // Gọi từ: CartPage, Navbar dropdown (bấm nút +)
    // Dùng: PUT /api/cart/update (không phải POST /add)
    // ──────────────────────────────────────────────────────────
    const increaseQty = async (cartItemId) => {
        const item = cartItems.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        try {
            await updateCartQtyApi(cartItemId, item.quantity + 1);  // PUT với quantity mới
            await fetchCart();
        } catch (err) {
            console.error("❌ Lỗi tăng số lượng:", err);
        }
    };

    // ──────────────────────────────────────────────────────────
    // decreaseQty — Giảm số lượng 1 đơn vị
    // ──────────────────────────────────────────────────────────
    // Nếu quantity = 1 → xóa luôn (DELETE)
    // Nếu quantity > 1 → giảm 1 (PUT /api/cart/update)
    // ──────────────────────────────────────────────────────────
    const decreaseQty = async (cartItemId) => {
        const item = cartItems.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        try {
            if (item.quantity === 1) {
                await deleteCartItemApi(cartItemId);            // Xóa luôn
            } else {
                await updateCartQtyApi(cartItemId, item.quantity - 1); // PUT với quantity mới
            }
            await fetchCart();
        } catch (err) {
            console.error("❌ Lỗi giảm số lượng:", err);
        }
    };

    // ══════════════════════════════════════════════════════════════
    // removeCartItem — Xóa 1 sản phẩm khỏi giỏ
    // ──────────────────────────────────────────────────────────────
    // Nhận vào: cartItemId → gọi API DELETE → tải lại giỏ
    // ══════════════════════════════════════════════════════════════
    const removeCartItem = async (cartItemId) => {
        try {
            await deleteCartItemApi(cartItemId);
            await fetchCart();
        } catch (err) {
            console.error("❌ Lỗi xóa sản phẩm:", err);
        }
    };

    // ══════════════════════════════════════════════════════════════
    // clearCart — Xóa toàn bộ giỏ hàng
    // ══════════════════════════════════════════════════════════════
    const clearCart = async () => {
        try {
            await deleteAllCartApi();
            await fetchCart();
        } catch (err) {
            console.error("❌ Lỗi xóa toàn bộ:", err);
        }
    };

    // ── Tính tổng số lượng sản phẩm ──
    const cartQty = cartItems.reduce((total, item) => total + item.quantity, 0);

    // ── Tính tổng tiền — dùng item.price từ server (đã tính sẵn) ──
    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    // ══════════════════════════════════════════════════════════════
    // Truyền tất cả giá trị & hàm xuống toàn bộ component con
    // ══════════════════════════════════════════════════════════════
    return (
        <ShoppingContext.Provider
            value={{
                cartItems,          // Mảng sản phẩm trong giỏ
                cartQty,            // Tổng số lượng
                totalPrice,         // Tổng tiền
                loading,            // Đang tải?

                addCartItem,        // Thêm sản phẩm (có check login)
                increaseQty,        // Tăng số lượng (nhận cartItemId)
                decreaseQty,        // Giảm số lượng (nhận cartItemId)
                removeCartItem,     // Xóa 1 sản phẩm (nhận cartItemId)
                clearCart,          // Xóa toàn bộ
                fetchCart,          // Tải lại giỏ từ server

                showLoginPopup,     // Trạng thái popup đăng nhập
                setShowLoginPopup,  // Bật/tắt popup đăng nhập
            }}
        >
            {children}
        </ShoppingContext.Provider>
    );
}

/**
 * useShoppingContext — Custom hook để dùng giỏ hàng ở bất kỳ component nào
 *
 * Cách dùng:
 *   const { addCartItem, cartItems } = useShoppingContext();
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingContext() {
    return useContext(ShoppingContext);
}
