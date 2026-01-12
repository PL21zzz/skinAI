import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://ml-api:8000';

export const predictImage = async (imagePath) => {
  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', fs.createReadStream(imagePath))

    // Call Python API
    const response = await axios.post(
      `${PYTHON_API_URL}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 30000 // 30 seconds timeout
      }
    )

    return response.data
  } catch (error) {
    console.error('Error calling Python API:', error.message)
    throw new Error('Không thể kết nối đến ML API. Vui lòng thử lại.')
  }
}

export const healthCheck = async () => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`, {
      timeout: 5000
    })
    return response.data
  } catch (error) {
    console.error('Python API health check failed:', error.message)
    return { status: 'error', message: error.message }
  }
}
