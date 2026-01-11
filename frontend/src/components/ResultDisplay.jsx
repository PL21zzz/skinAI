import { FaSpinner } from 'react-icons/fa';

// Dữ liệu tĩnh (Từ điển bệnh) - Đưa ra ngoài component cho tối ưu
const diseaseLabels = {
  'benign_keratosis-like_lesions': 'Sừng hóa quang tuyến',
  'basal_cell_carcinoma': 'Ung thư tế bào đáy',
  'actinic_keratoses': 'Sừng hóa lành tính (Sẹo già)',
  'dermatofibroma': 'U xơ da',
  'melanoma': 'U hắc tố ác tính (Melanoma)',
  'melanocytic_Nevi': 'Nốt ruồi lành tính',
  'vascular_lesions': 'Tổn thương mạch máu da'
};

const diseaseDescriptions = {
  'benign_keratosis-like_lesions': 'Tổn thương da do ánh nắng mặt trời, có thể tiến triển thành ung thư. Thường xuất hiện ở những vùng da thường xuyên tiếp xúc với ánh nắng.',
  'basal_cell_carcinoma': 'Loại ung thư da phổ biến nhất, thường ở vùng da tiếp xúc ánh nắng. Mặc dù ít khi di căn, nhưng cần điều trị sớm.',
  'actinic_keratoses': 'U da lành tính thường gặp ở người trung niên và cao tuổi. Đây là tổn thương không nguy hiểm và không chuyển thành ung thư.',
  'dermatofibroma': 'Khối u lành tính thường xuất hiện ở chân. Đây là tổn thương không nguy hiểm, phát triển chậm và hiếm khi gây biến chứng.',
  'melanoma': 'Loại ung thư da nguy hiểm nhất với khả năng di căn cao. Cần được phát hiện và điều trị sớm. Hãy đến bác sĩ da liễu ngay.',
  'melanocytic_Nevi': 'Nốt ruồi thông thường, lành tính và rất phổ biến. Cần theo dõi nếu có thay đổi bất thường về hình dạng hoặc màu sắc.',
  'vascular_lesions': 'Các bất thường của mạch máu dưới da, thường lành tính. Hầu hết chỉ ảnh hưởng về mặt thẩm mỹ.'
};

const ResultDisplay = ({ result, imageUrl, loading }) => {
  // Hàm helper
  const getDiseaseLabel = (className) => diseaseLabels[className] || className;
  const getDiseaseDescription = (className) => diseaseDescriptions[className] || 'Không có mô tả. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa.';

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  // Nếu chưa có gì thì không hiện
  if (!loading && !result) return null;

  return (
    <div className={`result-display mt-8 animate-slide-up`}>
      {loading ? (
        // Màn hình Loading
        <div className="loading text-center p-12">
          <div className="spinner w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xl text-gray-600 mt-4">Đang phân tích ảnh...</p>
        </div>
      ) : result ? (
        // Màn hình Kết quả
        <div className="result-content p-8 bg-slate-50 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Kết Quả Phân Tích</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ảnh đã upload */}
            <div className="image-section">
              <img src={imageUrl} alt="Analyzed image" className="result-image w-full rounded-2xl shadow-lg" />
            </div>

            {/* Thông tin chi tiết */}
            <div className="prediction-section space-y-6">
              <div className="primary-result">
                {/* Độ chính xác */}
                <div className={`result-badge inline-block px-4 py-2 rounded-lg font-bold mb-4 ${getConfidenceClass(result.confidence)}`}>
                  {(result.confidence * 100).toFixed(2)}% độ chính xác
                </div>

                {/* Tên bệnh (Gốc) */}
                <h4 className="text-3xl font-extrabold text-gray-800 mb-2">
                  {result.predicted_class}
                </h4>

                {/* Tên bệnh (Tiếng Việt) */}
                <p className="text-lg font-medium text-gray-500 mb-3">
                  {getDiseaseLabel(result.predicted_class)}
                </p>

                {/* Mô tả */}
                <p className="text-green-800 leading-relaxed bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  {getDiseaseDescription(result.predicted_class)}
                </p>
              </div>

              {/* Các khả năng khác */}
              <div className="all-predictions mt-6">
                <h5 className="text-lg font-semibold mb-3">Các khả năng khác:</h5>
                <div className="space-y-3">
                  {Object.entries(result.all_predictions).map(([className, prob]) => (
                    <div key={className} className="prediction-item p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{getDiseaseLabel(className)}</span>
                        <span className="text-gray-600 text-sm">{(prob * 100).toFixed(2)}%</span>
                      </div>
                      {/* Thanh tiến trình */}
                      <div className="progress-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${prob * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cảnh báo */}
              <div className="warning-box mt-6 p-5 bg-gradient-to-br from-amber-50 to-yellow-100 border-l-4 border-amber-500 rounded-xl shadow-sm">
                <p className="text-sm text-amber-900 leading-relaxed flex gap-2">
                 <span className="text-amber-500 font-bold text-lg">⚠</span>
                 <span>
                   <strong>Lưu ý quan trọng:</strong> Kết quả này chỉ mang tính chất tham khảo.
                   Vui lòng tham khảo ý kiến bác sĩ da liễu chuyên khoa để có chẩn đoán chính xác.
                 </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResultDisplay;
