import HistoryList from '../components/HistoryList';
import { FaHistory } from 'react-icons/fa';

const History = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 min-h-[500px]">

        {/* Tiêu đề trang */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl">
            <FaHistory />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Lịch Sử Phân Tích</h2>
            <p className="text-gray-500 text-sm mt-1">Xem lại các kết quả chẩn đoán trước đây của bạn</p>
          </div>
        </div>

        {/* Component danh sách */}
        <HistoryList />

      </div>
    </div>
  );
};

export default History;
