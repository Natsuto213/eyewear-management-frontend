// ManagerProductView/productConfig.ts

export interface Product {
  // Các field chung cơ bản nhất từ API Search
  productID?: number;
  id?: number;
  productName?: string;
  name?: string;
  sku: string;
  description: string;
  price: number;
  costPrice?: number;
  allowPreorder: boolean;
  isActive: boolean;

  // Thương hiệu và Loại sản phẩm
  brand?: { brandID?: number; brandName?: string };
  brandName?: string;
  Brand?: string;

  productType?: { productTypeID?: number; typeName?: string };
  typeName?: string;
  Product_Type?: string;

  // Hình ảnh
  images?: { imageID?: number; imageUrl?: string; isAvatar?: boolean }[];
  Image_URL?: string;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const productTypeConfig: Record<string, string> = {
  'Gọng kính': 'bg-blue-100 text-blue-700',
  'Tròng kính': 'bg-emerald-100 text-emerald-700',
  'Kính áp tròng': 'bg-pink-100 text-pink-700',
};