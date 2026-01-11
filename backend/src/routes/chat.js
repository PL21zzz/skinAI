import express from 'express'
import axios from 'axios'

const router = express.Router()

// Lấy địa chỉ Python từ biến môi trường (hoặc hardcode http://ml-api:8000 như bạn đã làm)
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://ml-api:8000'

router.post('/', async (req, res) => {
  try {
    const { message, disease_context } = req.body

    console.log(`💬 Sending chat to AI: ${message}`)

    // Gọi sang Python Container
    const response = await axios.post(`${PYTHON_API_URL}/chat`, {
      message,
      disease_context
    })

    res.json(response.data) // Trả kết quả { reply: "..." } về cho Frontend
  } catch (error) {
    console.error('❌ Chat Error:', error.message)
    res.status(500).json({ reply: "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau." })
  }
})

export default router
