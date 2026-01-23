import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      {/* 1. Dán toàn bộ phần HEADER của Kiên vào đây */}
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <img src="/logo.png" alt="ANNA" className="logo" />

          <nav className="nav">
            <a href="#" className="active">Trang chủ</a>
            <a href="#">Gọng kính</a>
            <a href="#">Tròng kính</a>
            <a href="#">Kính râm</a>
            <a href="#">Tìm cửa hàng</a>
            <a href="#">Xem thêm</a>
          </nav>
        </div>

        <div className="header-right">
  {/* Icon tìm kiếm (Kính lúp) */}
  <i className="fa-solid fa-magnifying-glass"></i>
  
  {/* Icon người dùng (đã có của bạn) */}
  <i className="fa-regular fa-user"></i>
  
  {/* Icon giỏ hàng */}
  <i className="fa-solid fa-cart-shopping"></i>
</div>
      </header>

      <main>
        <Outlet /> 
      </main>

      

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">

          {/* Góp ý */}
          <div className="footer-col">
            <h4>Góp ý</h4>
            <input type="text" placeholder="bla bla bla" />
            <button>Đóng góp ý kiến</button>
          </div>

          {/* Thông tin liên hệ */}
          <div className="footer-col">
            <h4>Hotline</h4>
            <p>090XXXXXXX</p>

            <h4>Email</h4>
            <p>abc@gmail.com</p>

            <h4>Địa chỉ</h4>
            <p>
              1a Đường abc, Phường xx, Xã xx,<br />
              TP. Hồ Chí Minh
            </p>
          </div>

          {/* Chính sách */}
          <div className="footer-col">
            <h4>Chính sách</h4>
            <ul>
              <li>Chính sách mua hàng</li>
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách vận chuyển</li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col social">
            <div className="social-icon">FB</div>
            <div className="social-icon">INS</div>
            <div className="social-icon">ZL</div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default MainLayout;