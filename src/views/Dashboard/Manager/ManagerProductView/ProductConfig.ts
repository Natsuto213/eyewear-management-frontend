// productConfig.ts
export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  allowPreorder: boolean;
  isActive: boolean;
  Image_URL: string;
  Brand: string;
  Product_Type: string;
  frameId?: number;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const productTypeConfig: Record<string, string> = {
  'Gọng kính': 'bg-blue-100 text-blue-700',
  'Tròng kính': 'bg-emerald-100 text-emerald-700',
  'Kính áp tròng': 'bg-pink-100 text-pink-700',
};