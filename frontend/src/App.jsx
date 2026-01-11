import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import các trang
import Navbar from './components/Navbar'; // <-- Nhớ Import cái này
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Detection from './pages/Detection';
import History from './pages/History';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">

          <Navbar />

          {/* 👇 SỬA DÒNG NÀY: Thêm max-w-7xl, mx-auto, px-4 để căn giữa giống Navbar */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400 mt-auto">
            © 2026 SkinAI Project - Hỗ trợ chẩn đoán bệnh da liễu
          </footer>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
