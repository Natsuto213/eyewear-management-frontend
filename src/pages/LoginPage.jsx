import loginImg from "../assets/login.png";
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <>
      

      {/* LOGIN */}
      <div className="login-page">
        <div className="login-left">
          <img src={loginImg} alt="Login" />
        </div>

        <div className="login-right">
          <h2>Đăng nhập</h2>
          <p className="sub">
            Hãy đăng nhập để được hưởng đặc quyền riêng của chúng tôi dành cho bạn
          </p>

          <label>Tài khoản/Email</label>
          <input type="text" placeholder="Nhập tài khoản" />

          <label>Mật khẩu</label>
          <input type="password" placeholder="Nhập mật khẩu" />

          <div className="remember">
            <input type="checkbox" />
            <span>Lưu tài khoản</span>
          </div>

          <button className="btn-login">Đăng nhập</button>

          <a className="forgot">Quên mật khẩu?</a>

          <button className="btn-google">Đăng nhập bằng Google</button>

          <p className="register">
            Bạn chưa có tài khoản? 
            <Link to="/register" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'inherit' }}>
               Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      
    </>
  );
}

export default LoginPage;
