import express from 'express'
import { predict, getHistory, getById, deletePrediction } from '../controllers/predictionController.js'

const router = express.Router()

// POST /api/predictions/predict - Upload and predict image
router.post('/predict', predict)

// GET /api/predictions/history - Get prediction history
router.get('/history', getHistory)

// GET /api/predictions/:id - Get prediction by ID
router.get('/:id', getById)

// DELETE /api/predictions/:id - Delete prediction
router.delete('/:id', deletePrediction)

export default router
