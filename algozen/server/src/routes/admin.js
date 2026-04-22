import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Problem from '../models/Problem.js'
import Submission from '../models/Submission.js'
import Contest from '../models/Contest.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Get platform statistics
router.get('/stats', requireAuth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalProblems, totalSubmissions, totalContests] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments({ isActive: true }),
      Submission.countDocuments(),
      Contest.countDocuments(),
    ])

    const acceptedSubmissions = await Submission.countDocuments({ status: 'Accepted' })
    const acceptanceRate =
      totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0

    res.json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
      totalContests,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List all users (paginated)
router.get('/users', requireAuth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const filter = {}
    if (search) {
      if (typeof search !== 'string' || search.length > 100) return res.status(400).json({ error: 'Invalid search' })
      filter.username = { $regex: escapeRegex(search), $options: 'i' }
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-__v')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ])

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Change user role
router.put('/users/:id/role', requireAuth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const { role } = req.body
    if (!['student', 'professor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
