import { Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./views/Loginpage";
import Registerpage from "./views/Registerpage";
import Profilepage from "./views/Profilepage";
import Account from "./components/PF/Account";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />

      <Route path="/profile" element={<Profilepage />}>
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
