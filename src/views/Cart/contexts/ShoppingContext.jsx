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
//   1. Khi mở trang  -> gọi GET /getAllCart -> hiển thị lên UI
//   2. Khi thêm/sửa/xóa -> gọi API tương ứng -> gọi lại GET để cập nhật UI
//   3. Backend tự xử lý logic trùng đơn -> Frontend chỉ cần gọi API
export function ShoppingContextProvider({ children }) {

    // ── State chính ──
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const fetchCart = useCallback(async () => {
        // Chưa đăng nhập → không gọi API (sẽ bị lỗi 401)
        const token = localStorage.getItem("access_token");
        console.log("Fetching cart... Token:", token);
        if (!token) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const apiItems = await getAllCartApi();
            const localItems = apiItems.map(mapApiItemToLocal); // Chuyển đổi format
            setCartItems(localItems);
        } catch (err) {
            console.error(" Lỗi tải giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Tự động tải giỏ hàng khi mở trang ──
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addCartItem = async (newItem) => {
        console.log("Theem vao gio hang", newItem)
        const token = localStorage.getItem("access_token");
        if (!token) {
            setShowLoginPopup(true);
            return;
        }
        try {
            await addCartItemApi(newItem, newItem.quantity);
            await fetchCart();
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 2000);
        } catch (err) {
            console.error("Lỗi thêm vào giỏ:", err);
            console.error(" Response data:", err.response?.data);
            console.error(" Response status:", err.response?.status);
        }
    };

    const increaseQty = async (cartItemId) => {
        const item = cartItems.find((i) => i.cartItemId === cartItemId);
        if (!item) return;

        try {
            await updateCartQtyApi(cartItemId, item.quantity + 1);  // PUT với quantity mới
            await fetchCart();
        } catch (err) {
            console.error(" Lỗi tăng số lượng:", err);
        }
    };

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
            console.error(" Lỗi giảm số lượng:", err);
        }
    };

    const removeCartItem = async (cartItemId) => {
        try {
            await deleteCartItemApi(cartItemId);
            await fetchCart();
        } catch (err) {
            console.error(" Lỗi xóa sản phẩm:", err);
        }
    };

    const clearCart = async () => {
        try {
            await deleteAllCartApi();
            await fetchCart();
        } catch (err) {
            console.error(" Lỗi xóa toàn bộ:", err);
        }
    };

    const cartQty = cartItems.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    return (
        <ShoppingContext.Provider
            value={{
                cartItems,
                cartQty,
                totalPrice,
                loading,

                addCartItem,
                increaseQty,
                decreaseQty,
                removeCartItem,     // Xóa 1 sản phẩm (nhận cartItemId)
                clearCart,          // Xóa toàn bộ
                fetchCart,          // Tải lại giỏ từ server

                showLoginPopup,
                setShowLoginPopup,
                showSuccessPopup,
                setShowSuccessPopup
            }}
        >
            {children}
        </ShoppingContext.Provider>
    );
}
export function useShoppingContext() {
    return useContext(ShoppingContext);
}
