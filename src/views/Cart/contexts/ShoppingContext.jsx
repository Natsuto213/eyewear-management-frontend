import { useState, createContext, useContext, useEffect } from "react";

const ShoppingContext = createContext()

//sẽ truyền xuống con các feild: 
/*
    cartQty: number
    totalPrice: number
    carItems: CartItem[]
    increaseQty: (id:number) => void
    decreaseQty: (id:number) => void
    addCartItem:(item:ProductItem) => void
    removeCartItem: (id:number) => void
    clearCart: () => void
*/

/* cartItem sẽ chứa [] với dữ liệu là const payload = {
           productId: product.id,
            priceProduct: product.price,                        // Giá sản phẩm chính
            nameProduct: product.name,                          // Tên sản phẩm chính
            imgProduct: product.imageUrls,                      // Ảnh sản phẩm chính
            quantity,
            prescription: rxData,                               // Tất cả loại đều gửi đơn thuốc                              // TODO: Giá dịch vụ cắt kính theo đơn (do backend tính)
            pairedProductId: pairedProduct?.id ?? null,         // null nếu mua đơn lẻ
            pricePairedProduct: pairedProduct?.price ?? null,   // Giá sản phẩm kèm
            namePairedProduct: pairedProduct?.name ?? null,     // Tên sản phẩm kèm
            imgPairedProduct: pairedProduct?.image ?? null, 
        }; */
export function ShoppingContextProvider({ children }) {
    const [cartItems, setCarrItems] = useState(() => {
        const jsonCartItems = localStorage.getItem("shopping_cart")
        return jsonCartItems ? JSON.parse(jsonCartItems) : []
    })

    useEffect(() => {
        localStorage.setItem("shopping_cart", JSON.stringify(cartItems))
    }, [cartItems])

    /**
     *  - Nếu TRÙNG → tăng quantity của item đó lên
     *  - Nếu CHƯA CÓ → thêm item mới vào cuối giỏ
     */
    const addCartItem = (newItem) => {
        console.log("Thêm vào giỏ:", newItem);
        const existingItem = cartItems.find(
            (item) =>
                item.productId === newItem.productId &&
                item.pairedProductId === newItem.pairedProductId
        );
        if (existingItem) {
            const updatedCart = cartItems.map((item) => {
                const isSameItem =
                    item.productId === newItem.productId &&
                    item.pairedProductId === newItem.pairedProductId;

                if (isSameItem) {
                    return { ...item, quantity: item.quantity + newItem.quantity };
                }
                return item; // Item khác: giữ nguyên
            });

            setCarrItems(updatedCart);
        } else {
            // Chưa có → thêm item mới vào giỏ 
            setCarrItems([...cartItems, newItem]);
        }
    };

    const increaseQty = (productId, pairedProductId) => {
        console.log("Tăng số lượng cho productId:", productId, "pairedProductId:", pairedProductId);
        const updatedCart = cartItems.map(item => {
            const isSameItem = item.productId === productId && item.pairedProductId === pairedProductId;
            if (isSameItem) {
                return { ...item, quantity: item.quantity + 1 };
            } else {
                return item;
            }
        })
        setCarrItems(updatedCart);
    }

    const decreaseQty = (productId, pairedProductId) => {
        console.log("Giảm số lượng cho productId:", productId, "pairedProductId:", pairedProductId);
        const existingItem = cartItems.find(item => item.productId === productId
            && item.pairedProductId === pairedProductId);
        if (existingItem) {
            if (existingItem.quantity === 1) {
                // Xóa item khỏi giỏ nếu giảm xuống 0
                removeCartItem(productId, pairedProductId);
            } else {
                const updateCart = cartItems.map(item => {
                    const isSameItem = item.productId === productId && item.pairedProductId === pairedProductId;
                    if (isSameItem) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return item;
                    }
                })
                setCarrItems(updateCart);
            }
        }

    }

    const removeCartItem = (productId, pairedProductId) => {
        console.log("Xóa item với productId:", productId, "pairedProductId:", pairedProductId);
        const updatedCart = cartItems.filter(item => !(item.productId === productId
            && item.pairedProductId === pairedProductId));
        setCarrItems(updatedCart);
    }

    // ── Tính tổng số lượng sản phẩm trong giỏ ──────────────────────────────
    const cartQty = cartItems.reduce((total, item) => total + item.quantity, 0);

    // ── Tính tổng tiền toàn bộ giỏ hàng ────────────────────────────────────
    // Mỗi item có thể có pairedProduct (mua kèm) → cộng cả 2 giá
    // priceProduct: giá sản phẩm chính
    // pricePairedProduct: giá sản phẩm kèm (null nếu mua đơn lẻ → dùng ?? 0)
    const totalPrice = cartItems.reduce((total, item) => {
        const itemPrice = item.priceProduct + (item.pricePairedProduct ?? 0);
        return total + item.quantity * itemPrice;
    }, 0); // ← initialValue = 0 bắt buộc phải có

    // ── Truyền tất cả giá trị/hàm xuống toàn bộ cây component con ──────────
    return (
        <ShoppingContext.Provider
            value={{
                cartItems,
                cartQty,
                totalPrice,
                increaseQty,
                decreaseQty,
                removeCartItem,
                addCartItem,
            }}
        >
            {children}
        </ShoppingContext.Provider>
    );
}

/**
 * useShoppingContext - Custom hook để dùng giỏ hàng ở bất kỳ component con nào
 *
 * Ví dụ dùng trong AddToCartBar:
 *   const { addCartItem } = useShoppingContext();
 *   addCartItem(payload);
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingContext() {
    return useContext(ShoppingContext);
}
