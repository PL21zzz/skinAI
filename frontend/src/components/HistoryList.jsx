import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaSpinner, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { predictionAPI } from '../services/api';

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Từ điển bệnh (dùng chung logic với ResultDisplay)
  const diseaseLabels = {
    'benign_keratosis-like_lesions': 'Sừng hóa quang tuyến',
    'basal_cell_carcinoma': 'Ung thư tế bào đáy',
    'actinic_keratoses': 'Sừng hóa lành tính',
    'dermatofibroma': 'U xơ da',
    'melanoma': 'U hắc tố ác tính',
    'melanocytic_Nevi': 'Nốt ruồi lành tính',
    'vascular_lesions': 'Tổn thương mạch máu da'
  };

  // Helper functions
  const getDiseaseLabel = (className) => diseaseLabels[className] || className;

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lấy URL ảnh từ server (xử lý đường dẫn tương đối)
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Thay đổi port nếu backend của bạn khác 5000
    const API_BASE = 'https://skinbe.onrender.com';
    // Loại bỏ dấu / đầu nếu có để tránh double slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${cleanPath}`;
  };

  // Gọi API lấy dữ liệu
  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictionAPI.getHistory(20);
      // Kiểm tra cấu trúc trả về (có thể là response.data hoặc response trực tiếp)
      const data = Array.isArray(response) ? response : (response.data || []);
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Không thể tải lịch sử. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa
  const deleteItem = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục này?')) return;

    try {
      await predictionAPI.delete(id);
      // Cập nhật state local để UI phản hồi ngay lập tức
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Không thể xóa mục này. Vui lòng thử lại.');
    }
  };

  // Chạy 1 lần khi component load
  useEffect(() => {
    loadHistory();
  }, []);

  // --- RENDER ---

  // 1. Trạng thái Loading
  if (loading) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">Đang tải lịch sử...</p>
      </div>
    );
  }

  // 2. Trạng thái Lỗi
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadHistory}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // 3. Trạng thái Trống (Chưa có lịch sử)
  if (history.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-600 mb-6">Chưa có lịch sử phân tích nào</p>
        <Link
          to="/detection"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 hover:-translate-y-1 transition shadow-lg shadow-teal-200"
        >
          Bắt đầu phân tích <FaArrowRight />
        </Link>
      </div>
    );
  }

  // 4. Hiển thị danh sách
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-1"
        >
          {/* Header Card */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
              {formatDate(item.created_at)}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"
              title="Xóa kết quả này"
            >
              <FaTrashAlt />
            </button>
          </div>

          {/* Ảnh */}
          <div className="relative overflow-hidden h-48 bg-gray-200">
            {item.image_path ? (
              <img
                src={getImageUrl(item.image_path)}
                alt="Analyzed result"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} // Fallback nếu ảnh lỗi
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Không có ảnh
              </div>
            )}
          </div>

          {/* Nội dung kết quả */}
          <div className="p-5">
            <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={getDiseaseLabel(item.predicted_class)}>
              {getDiseaseLabel(item.predicted_class)}
            </h4>

            <div className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${getConfidenceClass(item.confidence)}`}>
              {(item.confidence * 100).toFixed(1)}% độ chính xác
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
