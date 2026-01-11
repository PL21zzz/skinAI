import { useState, useRef } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';

const ImageUpload = ({ onImageSelected }) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Vui lòng chọn file ảnh (JPG, PNG, JPEG)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 10MB');
      return;
    }

    setSelectedFile(file);
    // Tạo URL preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const clearImage = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Dọn dẹp bộ nhớ
    setPreviewUrl(null);
    // Reset input file để chọn lại cùng 1 file được
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = () => {
    if (selectedFile) {
      setUploading(true);
      // Gọi hàm của cha
      onImageSelected(selectedFile);
      // Việc setUploading(false) sẽ do component cha quyết định khi có kết quả
    }
  };

  return (
    <div className="image-upload">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`upload-area ${dragOver ? 'drag-over' : ''} cursor-pointer p-12 text-center border-3 border-dashed border-slate-300 rounded-2xl bg-slate-50 min-h-[300px] flex flex-col items-center justify-center transition-all hover:border-blue-500 hover:bg-blue-50 ${dragOver ? 'border-blue-500 bg-blue-100 scale-105' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!previewUrl ? (
          <div className="upload-placeholder">
            <FaCamera className="text-6xl mb-4 text-teal-600 mx-auto" />
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-gray-500">
              Hỗ trợ: JPG, PNG, JPEG (Tối đa 10MB)
            </p>
          </div>
        ) : (
          <div className="preview-container relative w-full">
            <img src={previewUrl} alt="Preview" className="preview-image max-w-full max-h-[400px] rounded-lg object-contain mx-auto" />
            <button
              onClick={clearImage}
              className="clear-button absolute top-2 right-2 bg-red-500/90 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              <FaTimes className="inline mr-1"/> Xóa ảnh
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={uploadImage}
          disabled={uploading}
          className="upload-button w-full mt-6 py-4 bg-blue-500 text-white text-lg font-semibold rounded-xl hover:bg-blue-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed hover:-translate-y-1 shadow-md"
        >
          {uploading ? 'Đang phân tích...' : 'Bắt đầu phân tích'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
