# Hệ Thống Phát Hiện Bệnh Ngoài Da Sử Dụng AI - Thành Lưu

Ứng dụng web phân tích và phát hiện bệnh ngoài da sử dụng Deep Learning với mô hình Vision Transformer (ViT).

## Tổng Quan

Dự án này cung cấp một hệ thống hoàn chỉnh để phát hiện và phân loại các bệnh ngoài da thông qua hình ảnh, sử dụng công nghệ AI tiên tiến.

### Tính Năng Chính

**Phát hiện bệnh ngoài da** từ hình ảnh tải lên  
 **Độ chính xác cao** với mô hình Vision Transformer  
 **Xác thực người dùng** với JWT  
 **Lịch sử dự đoán** cho mỗi người dùng  
 **Giao diện thân thiện** với Vue.js và Tailwind CSS  
**API Documentation** tự động với FastAPI

### Tech Stack

- **Frontend**: Vue 3, Vue Router, Pinia, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Sequelize ORM, JWT
- **ML API**: Python, FastAPI, PyTorch, Hugging Face Transformers
- **Database**: MySQL
- **AI Model**: Vision Transformer (ViT)

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

- **Node.js** >= 16.x
- **Python** >= 3.8
- **MySQL** >= 8.0
- **npm** hoặc **yarn**
- **Git**

### Kiểm Tra Phiên Bản

```powershell
node --version
python --version
mysql --version
```

## Hướng Dẫn Cài Đặt

### 1️ Clone Dự Án

```powershell
git clone https://github.com/Nguyenthanhluu04/skin_disease.git
cd skin_disease
```

### 2️ Cài Đặt Database

#### Tạo Database MySQL

```sql
CREATE DATABASE skin_disease_db;
```

#### Cấu Hình Database

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skin_disease_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret
JWT_SECRET=your_secret_key_here

# Python API URL
PYTHON_API_URL=http://localhost:8000
```

### 3️ Cài Đặt Frontend

```powershell
cd frontend
npm install
```

### 4️ Cài Đặt Backend

```powershell
cd backend
npm install
```

### 5️ Cài Đặt ML API

#### Tạo Virtual Environment

```powershell
cd ml-api
python -m venv venv
```

#### Kích Hoạt Virtual Environment

```powershell
# Windows
venv\Scripts\activate
```

#### Cài Đặt Dependencies

```powershell
pip install -r requirements.txt
```

#### Cấu Hình ML API (Tùy Chọn)

Tạo file `.env` trong thư mục `ml-api/`:

```env
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
MODEL_NAME=Anwarkh1/Skin_Cancer-Image_Classification
```

### 6️ Tải Model AI (Tự Động)

Model sẽ tự động được tải về từ Hugging Face khi chạy ML API lần đầu tiên.

## ▶️ Chạy Dự Án

### Cách 1: Chạy Tất Cả Cùng Lúc (Khuyến Nghị)

Mở 3 terminal riêng biệt:

#### Terminal 1 - Backend

```powershell
cd backend
npm run dev
```

#### Terminal 2 - ML API

```powershell
cd ml-api
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 3 - Frontend

```powershell
cd frontend
npm run dev
```

### Cách 2: Sử Dụng NPM Scripts (Từng Service)

```powershell
# Frontend
npm run dev:frontend

# Backend
npm run dev:backend

# ML API
npm run dev:ml
```

## Truy Cập Ứng Dụng

Sau khi chạy tất cả services:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML API**: http://localhost:8000
- **ML API Docs**: http://localhost:8000/docs

## Cấu Trúc Dự Án

```
Predict_Skin_Diseases/
├── frontend/               # Vue.js Application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── views/         # Page components
│   │   ├── router/        # Route configuration
│   │   ├── stores/        # Pinia stores
│   │   └── services/      # API services
│   └── package.json
│
├── backend/               # Express.js API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   ├── uploads/          # Uploaded images
│   └── server.js
│
├── ml-api/               # FastAPI ML Service
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── model.py     # ML model wrapper
│   │   └── utils.py     # Utility functions
│   ├── models/          # Downloaded AI models
│   └── requirements.txt
│
├── package.json          # Root package
└── README.md            # This file
```

## API Endpoints

### Backend API (Port 5000)

#### Authentication

- `POST /api/users/register` - Đăng ký tài khoản
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/profile` - Thông tin người dùng (auth required)

#### Predictions

- `POST /api/predictions/predict` - Dự đoán bệnh (auth required)
- `GET /api/predictions/history` - Lịch sử dự đoán (auth required)
- `GET /api/predictions/:id` - Chi tiết dự đoán (auth required)

### ML API (Port 8000)

- `GET /` - API information
- `GET /health` - Health check
- `POST /predict` - Predict skin disease from image
- `GET /classes` - Get all disease classes
- `GET /docs` - Interactive API documentation

## Testing

### Test Backend API

```powershell
# Health check
curl http://localhost:5000/health
```

### Test ML API

```powershell
# Health check
curl http://localhost:8000/health

# Hoặc truy cập Swagger UI
# http://localhost:8000/docs
```

## Sử Dụng Ứng Dụng

1. **Đăng ký tài khoản** tại `/register`
2. **Đăng nhập** với email và password
3. **Tải lên hình ảnh** da cần phân tích tại trang `/detection`
4. **Xem kết quả** phân tích với độ tin cậy
5. **Xem lịch sử** các lần dự đoán tại `/history`

## Development

### Frontend Development

```powershell
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend Development

```powershell
cd backend
npm run dev      # Development with nodemon
npm start        # Production mode
```

### ML API Development

```powershell
cd ml-api
venv\Scripts\activate
uvicorn app.main:app --reload  # Auto-reload on changes
```

## Database Models

### User Model

- id (Primary Key)
- email (Unique)
- password (Hashed)
- fullName
- createdAt, updatedAt

### Prediction Model

- id (Primary Key)
- userId (Foreign Key)
- imagePath
- predictedClass
- confidence
- allPredictions (JSON)
- diseaseInfo (JSON)
- createdAt

## AI Model Information

- **Model**: Vision Transformer (ViT)
- **Source**: Hugging Face - `Anwarkh1/Skin_Cancer-Image_Classification`
- **Input**: 224x224 RGB images
- **Framework**: PyTorch + Transformers
- **Task**: Multi-class skin disease classification

## Security Features

- JWT Authentication
- Password hashing với bcrypt
- CORS protection
- Rate limiting
- Input validation
- Secure file upload

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skin_disease_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret
PYTHON_API_URL=http://localhost:8000
```

### ML API (.env)

```env
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
MODEL_NAME=Anwarkh1/Skin_Cancer-Image_Classification
```

## Troubleshooting

### Lỗi Kết Nối Database

- Kiểm tra MySQL đã chạy chưa
- Xác nhận thông tin đăng nhập trong `.env`
- Đảm bảo database đã được tạo

### Lỗi Port Đã Sử Dụng

```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :8000

# Kill process (thay PID bằng số process ID)
taskkill /PID <PID> /F
```

### Lỗi Python Virtual Environment

```powershell
# Xóa và tạo lại venv
cd ml-api
Remove-Item -Recurse -Force venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Lỗi Tải Model AI

- Kiểm tra kết nối internet
- Model sẽ tự động tải về lần đầu chạy (có thể mất vài phút)
- Nếu lỗi, xóa folder `ml-api/models` và chạy lại

## Tài Liệu Tham Khảo

- [Vue.js Documentation](https://vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyTorch Documentation](https://pytorch.org/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/)
- [Vision Transformer Paper](https://arxiv.org/abs/2010.11929)

## Contributors

- **Nguyễn Thanh Lưu** - [GitHub](https://github.com/Nguyenthanhluu04)

## License

MIT License - Xem file `LICENSE` để biết thêm chi tiết.

## Acknowledgments

- Hugging Face cho pre-trained Vision Transformer model
- Anwarkh1 cho Skin Cancer Classification model
- Vue.js, Express.js và FastAPI communities

---
