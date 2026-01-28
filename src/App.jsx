import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './views/Homepage';
import LoginPage from './views/Loginpage';
import RegisterPage from './views/Registerpage';
import AllProduct from './views/AllProduct';
import Profilepage from './views/Profilepage';
import Account from './components/PF/Account';
import CSBH from './views/CSBHpage';
import CSMH from './views/CSMHpage';
import CSDT from './views/CSDTpage';


function App() {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-product" element={<AllProduct />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bao-hanh" element={<CSBH />} />
        <Route path="/chinh-sach-mua-hang" element={<CSMH />} />
        <Route path="/chinh-sach-doi-tra" element={<CSDT />} />


        {/* Profile layout */}
        <Route path="/profile" element={<Profilepage />}>
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    
  );
}

export default App;
