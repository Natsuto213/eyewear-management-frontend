import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout'; // Đã sửa đường dẫn
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;