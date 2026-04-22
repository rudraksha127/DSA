import { Router } from 'express'
import Problem from '../models/Problem.js'
import DailyChallenge from '../models/DailyChallenge.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

// List problems with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { track, topic, difficulty, search, page = 1, limit = 20 } = req.query
    const filter = { isActive: true }

    if (track) filter.track = track
    if (topic) filter.topic = topic
    if (difficulty) filter.difficulty = difficulty
    if (search) filter.title = { $regex: search, $options: 'i' }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select('-testCases')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Problem.countDocuments(filter),
    ])

    res.json({
      problems,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get today's daily challenge
router.get('/daily', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const daily = await DailyChallenge.findOne({
      date: { $gte: today, $lt: tomorrow },
    }).populate({ path: 'problemId', select: '-testCases' })

    if (!daily) return res.status(404).json({ error: 'No daily challenge today' })
    res.json(daily)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get problem by slug
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isActive: true }).select(
      '-testCases'
    )
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json(problem)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create problem (admin only)
router.post('/', requireAuth, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.create(req.body)
    res.status(201).json(problem)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Update problem (admin only)
router.put('/:id', requireAuth, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json(problem)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete problem (admin only)
router.delete('/:id', requireAuth, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json({ message: 'Problem deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
