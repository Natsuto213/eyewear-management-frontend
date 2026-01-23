import loginImg from "../assets/login.png";
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <>
      

      {/* REGISTER FORM */}
      <div className="login-page">
        <div className="login-left">
          <img src={loginImg} alt="Login" />
        </div>

        <div className="login-right">
          <h2>Đăng ký tài khoản</h2>
          <p className="sub">
            Hãy đăng ký để được hưởng đặc quyền riêng của bạn
          </p>

          <label>Tên tài khoản</label>
          <input type="text" placeholder="Nhập tên tài khoản" />

          <label>Mật khẩu</label>
          <input type="password" placeholder="Nhập mật khẩu" />

          <label>Xác nhận mật khẩu</label>
          <input type="password" placeholder="Xác nhận mật khẩu" />

          <label>Email</label>
          <input type="email" placeholder="Nhập email" />

          <label>Số điện thoại</label>
          <input type="text" placeholder="Nhập số điện thoại" />

          {/* Nút này thực hiện hành động Đăng ký */}
          <button className="btn-regis">Đăng ký ngay</button>

          <button className="btn-google">Đăng nhập bằng Google</button>

          {/* Sửa lại phần này để quay lại trang Login */}
          <p className="register">
            Bạn đã có tài khoản? 
            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'inherit' }}>
               Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>

      
    </>
  );
}

export default RegisterPage;
