import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import User from '../models/User.js'

// Register validation
const registerValidation = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username phải có ít nhất 3 ký tự'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự'),
  body('full_name').optional().trim()
]

export const register = [
  ...registerValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        })
      }

      const { username, email, password, full_name } = req.body

      // Check if user exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username hoặc email đã tồn tại'
        })
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        full_name
      })

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name
          },
          token
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi đăng ký'
      })
    }
  }
]

// Login validation
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username không được để trống'),
  body('password').notEmpty().withMessage('Password không được để trống')
]

export const login = [
  ...loginValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        })
      }

      const { username, password } = req.body

      // Find user
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username hoặc password không đúng'
        })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username hoặc password không đúng'
        })
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name
          },
          token
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi đăng nhập'
      })
    }
  }
]
