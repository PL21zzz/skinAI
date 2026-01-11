import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Gọi hàm login từ Context (nó sẽ gọi API /users/login)
    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      setSuccessMessage(result.message || 'Đăng nhập thành công!');
      // Chuyển hướng sau 1s
      setTimeout(() => {
        navigate('/detection'); // Giả sử bạn muốn chuyển đến trang chẩn đoán
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-10 animate-fade-in bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
          <p className="text-gray-500">Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded text-sm">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <FaUser className="text-teal-600"/> Tên đăng nhập
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <FaLock className="text-teal-600"/> Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition duration-300 flex justify-center items-center shadow-md hover:shadow-lg"
          >
            {loading ? (
              <><FaSpinner className="animate-spin mr-2" /> Đang xử lý...</>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-teal-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
