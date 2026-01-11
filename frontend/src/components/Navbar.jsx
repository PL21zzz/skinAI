import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDna, FaSignOutAlt, FaUserCircle, FaHistory, FaStethoscope } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Đăng xuất xong đá về trang Login
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white text-lg shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
              <FaDna />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-emerald-600">
              SkinAI
            </span>
          </Link>

          {/* --- MENU --- */}
          <div className="flex items-center gap-6 font-medium text-sm text-gray-600">

            <Link to="/" className="hover:text-teal-600 transition">Trang chủ</Link>

            {isAuthenticated ? (
              /* MENU KHI ĐÃ ĐĂNG NHẬP */
              <>
                <Link to="/detection" className="flex items-center gap-1 hover:text-teal-600 transition">
                  <FaStethoscope /> Chẩn đoán
                </Link>

                <Link to="/history" className="flex items-center gap-1 hover:text-teal-600 transition">
                  <FaHistory /> Lịch sử
                </Link>

                <div className="h-5 w-[1px] bg-gray-300 mx-1"></div> {/* Gạch dọc ngăn cách */}

                <div className="flex items-center gap-2 text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                  <FaUserCircle className="text-lg" />
                  <span className="truncate max-w-[150px]">{user?.full_name || user?.username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  title="Đăng xuất"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              /* MENU KHI KHÁCH VÃNG LAI */
              <>
                <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
                <Link to="/login" className="hover:text-teal-600 transition">Đăng nhập</Link>
                <Link
                  to="/register"
                  className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition shadow-md shadow-teal-200 font-bold"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
