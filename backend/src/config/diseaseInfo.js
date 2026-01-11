// Thông tin đơn giản về các loại bệnh da
export const DISEASE_INFO = {
  'akiec': {
    nameVi: 'Sừng hóa quang tuyến',
    nameEn: 'Actinic Keratoses',
    description: 'Tổn thương da do ánh nắng mặt trời, có thể tiến triển thành ung thư. Thường xuất hiện ở những vùng da thường xuyên tiếp xúc với ánh nắng như mặt, tai, cổ, cánh tay.'
  },
  'bcc': {
    nameVi: 'Ung thư tế bào đáy',
    nameEn: 'Basal Cell Carcinoma',
    description: 'Loại ung thư da phổ biến nhất, thường ở vùng da tiếp xúc ánh nắng. Mặc dù ít khi di căn, nhưng cần điều trị sớm để tránh hủy hoại mô xung quanh.'
  },
  'bkl': {
    nameVi: 'Sừng hóa lành tính (Sẹo già)',
    nameEn: 'Benign Keratosis',
    description: 'U da lành tính thường gặp ở người trung niên và cao tuổi. Đây là tổn thương không nguy hiểm, không lây nhiễm và không chuyển thành ung thư.'
  },
  'df': {
    nameVi: 'U xơ da',
    nameEn: 'Dermatofibroma',
    description: 'Khối u lành tính thường xuất hiện ở chân. Đây là tổn thương không nguy hiểm, phát triển chậm và hiếm khi gây biến chứng, có thể để nguyên hoặc loại bỏ.'
  },
  'mel': {
    nameVi: 'U hắc tố ác tính (Melanoma)',
    nameEn: 'Melanoma',
    description: 'Loại ung thư da nguy hiểm nhất với khả năng di căn cao. Cần được phát hiện và điều trị sớm. Nếu nghi ngờ, hãy đến bác sĩ da liễu ngay lập tức.'
  },
  'nv': {
    nameVi: 'Nốt ruồi lành tính',
    nameEn: 'Melanocytic Nevi',
    description: 'Nốt ruồi thông thường, lành tính và rất phổ biến. Hầu hết mọi người đều có nốt ruồi. Cần theo dõi nếu có thay đổi bất thường về hình dạng hoặc màu sắc.'
  },
  'vasc': {
    nameVi: 'Tổn thương mạch máu da',
    nameEn: 'Vascular Lesions',
    description: 'Các bất thường của mạch máu dưới da, thường lành tính. Bao gồm các nốt máu nổi, mạch máu giãn. Hầu hết chỉ ảnh hưởng về mặt thẩm mỹ.'
  }
}

// Hàm helper để lấy thông tin bệnh
export const getDiseaseInfo = (diseaseCode) => {
  return DISEASE_INFO[diseaseCode] || {
    nameVi: diseaseCode,
    nameEn: diseaseCode,
    description: 'Không có thông tin chi tiết. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa da liễu.'
  }
}
