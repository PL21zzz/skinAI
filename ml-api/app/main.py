from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
from app.model import SkinDiseaseModel
from app.utils import save_upload_file, cleanup_file
import logging
from pydantic import BaseModel
import google.generativeai as genai
import asyncio

# Load biến môi trường
load_dotenv()

# Cấu hình log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Skin Disease Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. CẤU HÌNH GEMINI (CHATBOT) ---
GENAI_KEY = os.getenv("GEMINI_API_KEY")
model_gemini = None

if GENAI_KEY:
    try:
        genai.configure(api_key=GENAI_KEY)
        # Sử dụng model flash (Chuẩn mới nhất của Google)
        model_gemini = genai.GenerativeModel('gemini-flash-latest')
        logger.info("✅ Cấu hình Gemini thành công (Model:gemini-flash-latest)")
    except Exception as e:
        logger.error(f"⚠️ Lỗi cấu hình Gemini: {e}")
else:
    logger.warning("⚠️ Chưa có GEMINI_API_KEY trong docker-compose.yml")

# --- 2. CẤU HÌNH MODEL PHÂN TÍCH ẢNH ---
model = None

@app.on_event("startup")
async def startup_event():
    """Tải model AI khi server khởi động"""

    # [DEBUG] Kiểm tra xem tài khoản Key của bạn có những model nào
    if GENAI_KEY:
        logger.info("🔍 Đang kiểm tra danh sách Model Google khả dụng...")
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    logger.info(f"   ---> Tìm thấy model: {m.name}")
        except Exception as e:
            logger.error(f"❌ Không lấy được danh sách model: {e}")

    global model
    logger.info("⏳ Đang tải model phân tích ảnh (Mất khoảng 1-2 phút)...")
    try:
        # Chạy trong thread riêng để không chặn server
        model = SkinDiseaseModel()
        logger.info("✅ Model phân tích ảnh đã tải xong!")
    except Exception as e:
        logger.error(f"❌ Không tải được model ảnh: {str(e)}")

@app.get("/")
async def root():
    return {"status": "running", "ai_model_loaded": model is not None}

# --- API PHÂN TÍCH ẢNH ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="AI đang khởi động, vui lòng đợi 30 giây rồi thử lại.")

    temp_file_path = None
    try:
        temp_file_path = await save_upload_file(file)
        result = model.predict(temp_file_path)

        return JSONResponse(content={
            "success": True,
            "predicted_class": result['predicted_class'],
            "predicted_class_vi": result.get('predicted_class_vi', result['predicted_class']),
            "confidence": result['confidence'],
            "all_predictions": result['all_predictions']
        })
    except Exception as e:
        logger.error(f"Lỗi khi phân tích: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý ảnh: {str(e)}")
    finally:
        if temp_file_path:
            cleanup_file(temp_file_path)

# --- API CHATBOT ---
class ChatRequest(BaseModel):
    message: str
    disease_context: str = None

@app.post("/chat")
async def chat_with_doctor(request: ChatRequest):
    if not model_gemini:
        raise HTTPException(status_code=503, detail="Chưa cấu hình API Key Gemini hoặc Key bị lỗi.")

    try:
        context = ""
        if request.disease_context:
            context = f"Thông tin bệnh nhân: Vừa được chẩn đoán '{request.disease_context}'. "

        prompt = f"""
        Bạn là DermAssist, trợ lý y tế chuyên về da liễu.
        Nhiệm vụ: Trả lời ngắn gọn, trấn an người bệnh.
        {context}
        Câu hỏi của người dùng: "{request.message}"
        """

        response = model_gemini.generate_content(prompt)

        if response.text:
            return {"reply": response.text}
        else:
            return {"reply": "Xin lỗi, tôi chưa hiểu câu hỏi. Bạn hỏi lại nhé?"}

    except Exception as e:
        logger.error(f"Lỗi Chatbot: {e}")
        # Nếu lỗi 404, log sẽ hiện ra để ta biết đường sửa
        raise HTTPException(status_code=500, detail="Bác sĩ ảo đang bận, thử lại sau.")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
