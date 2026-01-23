import { Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./views/Loginpage";
import Registerpage from "./views/Registerpage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
