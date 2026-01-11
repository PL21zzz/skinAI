import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaIdCard, FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Lấy hàm register từ Context

  // State quản lý form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  // State quản lý trạng thái
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Xử lý nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý Submit
  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validate mật khẩu khớp nhau
    if (formData.password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // 2. Gọi API đăng ký
    const result = await register(formData);

    setLoading(false);

    if (result.success) {
      setSuccessMessage(result.message || 'Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/detection'); // Chuyển sang trang chính
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-10 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký</h2>
          <p className="text-gray-600">Tạo tài khoản để lưu lịch sử phân tích</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Thông báo lỗi/thành công */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Họ tên */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaIdCard /> Họ và Tên
            </label>
            <input
              name="full_name"
              type="text"
              placeholder="Nhập họ và tên"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaUser /> Username *
            </label>
            <input
              name="username"
              type="text"
              placeholder="Nhập username (tối thiểu 3 ký tự)"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaEnvelope /> Email *
            </label>
            <input
              name="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaLock /> Password *
            </label>
            <input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaLock /> Xác nhận Password *
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {confirmPassword && formData.password !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Mật khẩu không khớp</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading || (confirmPassword && formData.password !== confirmPassword)}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center mt-6"
          >
            {loading ? <><FaSpinner className="animate-spin mr-2" /> Đang đăng ký...</> : 'Đăng Ký'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 text-sm hover:text-gray-700">
            Hoặc tiếp tục không cần đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
