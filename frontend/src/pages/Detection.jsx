import { useState, useEffect } from 'react';
import { FaArrowLeft, FaFileMedical, FaRobot, FaTimes, FaCommentMedical, FaChevronDown } from 'react-icons/fa';
import { predictionAPI } from '../services/api';

// Import các component con
import ImageUpload from '../components/ImageUpload';
import ResultDisplay from '../components/ResultDisplay';
import ChatBot from '../components/ChatBot';

// Hàm helper để lấy tên bệnh tiếng Việt cho Chatbot
const getVietnameseDiseaseName = (className) => {
    const diseaseLabels = {
      'benign_keratosis-like_lesions': 'Sừng hóa quang tuyến',
      'basal_cell_carcinoma': 'Ung thư tế bào đáy',
      'actinic_keratoses': 'Sừng hóa lành tính',
      'dermatofibroma': 'U xơ da',
      'melanoma': 'U hắc tố ác tính',
      'melanocytic_Nevi': 'Nốt ruồi lành tính',
      'vascular_lesions': 'Tổn thương mạch máu da'
    };
    return diseaseLabels[className] || className;
};

const Detection = () => {
  // State
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Xử lý khi chọn ảnh xong
  const handleImageSelected = async (file) => {
    setLoading(true);
    setResult(null);
    setIsChatOpen(false);

    // Tạo URL preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      // Gọi API phân tích
      const response = await predictionAPI.predictImage(file);

      // Xử lý dữ liệu trả về (đảm bảo đúng cấu trúc)
      const data = response.data || response;
      setResult(data);

      // Tự động mở Chatbot sau 1.5s
      setTimeout(() => {
        setIsChatOpen(true);
      }, 1500);

    } catch (error) {
      console.error('Error predicting image:', error);
      alert('Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại!');
      // Nếu lỗi thì dọn dẹp URL ảnh
      URL.revokeObjectURL(url);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Reset để làm lại từ đầu
  const resetAnalysis = () => {
    setResult(null);
    setIsChatOpen(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  // Cleanup URL ảnh khi component bị hủy (thoát trang)
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 min-h-screen relative pb-20 font-sans">

      {/* --- Màn hình 1: Upload (Hiện khi CHƯA có kết quả và KHÔNG loading) --- */}
      {!result && !loading && (
        <div className="animate-fade-in transition-all duration-500 ease-in-out mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-50 mb-8 hover:shadow-2xl transition-all">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Chẩn Đoán Hình Ảnh</h2>
              <p className="text-slate-500">Tải lên hình ảnh vùng da cần kiểm tra để AI phân tích</p>
            </div>
            {/* Component Upload */}
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        </div>
      )}

      {/* --- Màn hình 2: Kết quả (Hiện khi ĐÃ có kết quả hoặc ĐANG loading) --- */}
      {(result || loading) && (
        <div className="animate-fade-in-up mt-8">
          {/* Nút quay lại chỉ hiện khi ĐÃ có kết quả */}
          {result && !loading && (
            <button
                onClick={resetAnalysis}
                className="mb-6 flex items-center text-slate-500 hover:text-teal-600 transition font-medium"
            >
                <FaArrowLeft className="mr-2" />
                Phân tích ảnh khác
            </button>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-teal-50 overflow-hidden max-w-5xl mx-auto">
            <div className="bg-teal-50 p-6 border-b border-teal-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                <FaFileMedical />
                Kết quả phân tích chi tiết
              </h3>
            </div>

            <div className="p-0">
              {/* Component Hiển thị kết quả (Nó tự xử lý trạng thái loading bên trong) */}
              <ResultDisplay
                result={result}
                imageUrl={imageUrl}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Chatbot Floating Button & Window (Chỉ hiện khi CÓ kết quả) --- */}
      {result && !loading && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

          {/* Cửa sổ Chat */}
          {isChatOpen && (
            <div className="w-[380px] h-[500px] animate-fade-in-up z-50">
              <ChatBot
                initialContext={getVietnameseDiseaseName(result.predicted_class)}
              />
            </div>
          )}

          {/* Nút tròn Chat */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 flex items-center justify-center text-2xl animate-bounce-slow relative group z-50"
          >
            {isChatOpen ? <FaChevronDown /> : <FaCommentMedical />}

            {!isChatOpen && (
              <span className="absolute right-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                Hỏi bác sĩ AI
              </span>
            )}
          </button>
        </div>
      )}

    </div>
  );
};

export default Detection;
