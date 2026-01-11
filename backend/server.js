import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import predictionRoutes from './src/routes/predictionRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import chatRoutes from './src/routes/chat.js'
import { sequelize } from './src/config/database.js'

// Load environment variables
dotenv.config()

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Static files - serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/predictions', predictionRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully')

    // Sync database models
    await sequelize.sync({ alter: true })
    console.log('✅ Database models synchronized')

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
      console.log(`📝 Environment: ${process.env.NODE_ENV}`)
      console.log(`🔗 Python API: ${process.env.PYTHON_API_URL}`)
    })
  } catch (error) {
    console.error('❌ Unable to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
