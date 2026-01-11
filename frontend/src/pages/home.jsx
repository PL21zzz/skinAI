import { Link } from 'react-router-dom';
import {
  FaArrowRight, FaPlayCircle, FaCheckCircle, FaShieldAlt,
  FaMicroscope, FaBrain, FaBolt, FaUserShield, FaExclamationTriangle
} from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-container py-10">

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            <span className="text-teal-700 text-sm font-bold uppercase tracking-wider">Công nghệ AI 2025</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Chăm sóc làn da <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              Thông Minh & Chính Xác
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            Hệ thống sử dụng trí tuệ nhân tạo Vision Transformer để phân tích sớm các dấu hiệu bất thường trên da. Đơn giản, nhanh chóng và bảo mật.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/detection" className="group px-8 py-4 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/40 hover:bg-teal-700 hover:shadow-teal-600/50 transition-all flex items-center justify-center">
              <span className="mr-2">Bắt đầu chẩn đoán</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center">
              <FaPlayCircle className="mr-2 text-teal-600 text-xl" />
              Xem demo
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-teal-500" /> Miễn phí 100%
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-teal-500" /> Bảo mật dữ liệu
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative hidden lg:block animate-fade-in-right">
          <div className="absolute inset-0 bg-teal-200 rounded-full blur-3xl opacity-20 transform translate-x-10 translate-y-10"></div>

          <img
            src="https://img.freepik.com/free-vector/doctor-examining-patient-clinic-illustrated_23-2148856559.jpg"
            alt="Medical AI"
            className="relative z-10 w-full rounded-2xl shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500"
          />

          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl">
              <FaMicroscope />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Độ chính xác</p>
              <p className="text-xl font-bold text-slate-800">98.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Tại sao chọn SkinAI?</h2>
          <div className="w-16 h-1 bg-teal-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 bg-teal-100 text-teal-600">
              <FaBrain />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Công nghệ AI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Sử dụng Vision Transformer (ViT) từ Google để phân tích hình ảnh chuyên sâu.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 bg-emerald-100 text-emerald-600">
              <FaBolt />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Kết quả tức thì</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Không cần chờ đợi. Nhận kết quả phân tích chi tiết chỉ sau 3-5 giây xử lý.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 bg-cyan-100 text-cyan-600">
              <FaUserShield />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Riêng tư tuyệt đối</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Hình ảnh của bạn được mã hóa và tự động xóa khỏi hệ thống sau khi phân tích.</p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg shadow-sm">
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="text-amber-500 text-2xl mt-1" />
          <div>
            <h4 className="text-amber-800 font-bold text-lg mb-1">Khuyến cáo y tế quan trọng</h4>
            <p className="text-amber-700 text-sm">
              Kết quả từ SkinAI chỉ mang tính chất tham khảo và hỗ trợ sàng lọc ban đầu. Hệ thống <strong>không thay thế</strong> chẩn đoán của bác sĩ chuyên khoa. Nếu bạn có triệu chứng lo ngại, vui lòng đến cơ sở y tế gần nhất.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
