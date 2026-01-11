import { upload } from '../middleware/upload.js'
import { optionalAuth } from '../middleware/auth.js'
import { predictImage } from '../services/pythonApiService.js'
import Prediction from '../models/Prediction.js'
import { getDiseaseInfo } from '../config/diseaseInfo.js'
import fs from 'fs'
import path from 'path'

export const predict = [
  optionalAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng upload một file ảnh'
        })
      }

      // Get prediction from Python API
      const predictionResult = await predictImage(req.file.path)

      // Get disease information
      const diseaseInfo = getDiseaseInfo(predictionResult.predicted_class)

      // Save to database
      const prediction = await Prediction.create({
        image_path: `/uploads/${req.file.filename}`,
        predicted_class: predictionResult.predicted_class,
        confidence: predictionResult.confidence,
        all_predictions: predictionResult.all_predictions,
        user_id: req.userId || null
      })

      res.status(200).json({
        success: true,
        message: 'Phân tích thành công',
        data: {
          id: prediction.id,
          predicted_class: prediction.predicted_class,
          predicted_class_vi: diseaseInfo.nameVi,
          predicted_class_en: diseaseInfo.nameEn,
          description: diseaseInfo.description,
          confidence: prediction.confidence,
          all_predictions: prediction.all_predictions,
          image_path: prediction.image_path,
          created_at: prediction.created_at
        }
      })
    } catch (error) {
      // Clean up uploaded file if prediction fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err)
        })
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi phân tích ảnh'
      })
    }
  }
]

export const getHistory = [
  optionalAuth,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10
      const offset = parseInt(req.query.offset) || 0

      const where = req.userId ? { user_id: req.userId } : {}

      const predictions = await Prediction.findAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']]
      })

      res.status(200).json({
        success: true,
        data: predictions
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Không thể tải lịch sử'
      })
    }
  }
]

export const getById = async (req, res) => {
  try {
    const prediction = await Prediction.findByPk(req.params.id)

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả phân tích'
      })
    }

    res.status(200).json({
      success: true,
      data: prediction
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra'
    })
  }
}

export const deletePrediction = [
  optionalAuth,
  async (req, res) => {
    try {
      const prediction = await Prediction.findByPk(req.params.id)

      if (!prediction) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy kết quả phân tích'
        })
      }

      // Delete image file
      const imagePath = path.join(process.cwd(), 'uploads', path.basename(prediction.image_path))
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }

      // Delete from database
      await prediction.destroy()

      res.status(200).json({
        success: true,
        message: 'Đã xóa thành công'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa'
      })
    }
  }
]
