# Eyewear Management Frontend

Frontend cho hệ thống quản lý và kinh doanh kính mắt, được xây dựng bằng **ReactJS** với mục tiêu cung cấp trải nghiệm mua sắm trực quan, mượt mà và dễ mở rộng cho nhiều vai trò người dùng (khách hàng, sales staff, operations staff, manager, admin).

Ứng dụng này giao tiếp với backend `eyewear-management-backend` để xử lý toàn bộ nghiệp vụ: xác thực, quản lý sản phẩm, giỏ hàng, checkout, đơn hàng, thanh toán, vận chuyển, đổi trả, kho vận và dashboard.

---

## 1) Công nghệ sử dụng

### Core
- **ReactJS**
- **JavaScript (ES6+)**
- **CSS**
- **Tailwind CSS**

### HTTP & API
- **Axios** để gọi REST API

### DX (Developer Experience)
- **Alias import từ `src`** (giúp import ngắn gọn, dễ maintain)

### Tích hợp nghiệp vụ từ backend
Frontend làm việc với các nhóm tính năng mà backend đang cung cấp:
- JWT Authentication & Role-based Authorization
- Product/Catalog, Cart, Checkout, Orders
- Thanh toán online (VNPAY, PayOS)
- Vận chuyển GHN
- Đổi trả/hoàn tiền
- OCR đơn kính thuốc
- Chatbot gợi ý sản phẩm
- Dashboard thống kê

> Ghi chú: Danh sách trên phản ánh các module API thực tế của backend để frontend tích hợp đúng luồng nghiệp vụ.

---

## 2) Kiến trúc thư mục đề xuất

> Bạn có thể điều chỉnh theo cấu trúc hiện tại của project, nhưng nên giữ tính nhất quán theo feature.

```bash
src/
├── assets/                 # Hình ảnh, icon, static files
├── components/             # UI components tái sử dụng
├── pages/                  # Page-level components
├── layouts/                # Main layout, dashboard layout...
├── routes/                 # Route config, protected route
├── services/               # Axios client, API modules
├── hooks/                  # Custom hooks
├── contexts/               # React Context (auth, cart...)
├── utils/                  # Helper functions
├── constants/              # Hằng số, enum phía frontend
├── styles/                 # Global CSS/Tailwind layers
└── main.jsx / App.jsx
```

---

## 3) Cài đặt và chạy local

## Yêu cầu môi trường
- Node.js version 18 or above
- npm hoặc yarn

### Cài dependencies
```bash
npm install
```

### Chạy môi trường development
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview bản build
```bash
npm run preview
```

---

## 4) Cấu hình môi trường

Tạo file `.env` (hoặc `.env.local`) và khai báo endpoint backend:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Nếu đang dùng Create React App thay vì Vite, đổi sang:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

---

## 5) Cấu hình Axios

Ví dụ `src/services/httpClient.js`:

```js
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default httpClient;
```

Khuyến nghị thêm response interceptor để xử lý `401`, refresh token hoặc điều hướng login.

---

## 6) Alias import từ `src`

### Nếu dùng Vite
`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

`jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 7) Chuẩn code và convention khuyến nghị

- Tách API theo domain: `authApi`, `productApi`, `orderApi`, ...
- Không gọi API trực tiếp trong UI component lớn; ưu tiên service/hook.
- Đồng nhất naming:
  - Component: `PascalCase`
  - Function/variable: `camelCase`
  - Constant: `UPPER_SNAKE_CASE`
- Tách rõ trạng thái loading/error/success cho từng request.
- Luôn kiểm soát quyền hiển thị UI theo role người dùng.

---

## 8) List tích hợp backend

- Đăng nhập / đăng xuất / refresh token
- Product listing + product detail
- Cart CRUD
- Checkout preview (shipping fee, promotion, deposit)
- Tạo đơn và theo dõi trạng thái đơn
- Thanh toán VNPAY / PayOS
- Đổi trả và upload minh chứng
- Dashboard cho sales staff / operation staff / manager
- OCR đơn kính thuốc
- Chatbot gợi ý sản phẩm

---

## 9) Triển khai (Deployment)

- Build frontend bằng `npm run build`
- Deploy thư mục `dist/` lên nền tảng phù hợp (Vercel, Netlify, Nginx, ...)
- Cấu hình biến môi trường production:
  - `VITE_API_BASE_URL`
- Cấu hình CORS tương thích ở backend cho domain frontend

---

## 10) Định hướng nâng cấp

- Bổ sung state management tập trung (nếu app mở rộng nhanh)
- Bổ sung test cho UI và API flows
- Chuẩn hoá error boundary + logging phía client
- Tối ưu performance: code splitting, lazy loading, image optimization
- PWA và khả năng offline cho một số luồng cơ bản

---

## License

Nội bộ dự án học tập/doanh nghiệp. Cập nhật theo chính sách của team.