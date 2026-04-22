import { Router } from 'express'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import DailyChallenge from '../models/DailyChallenge.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

const VALID_TRACKS = ['DSA', 'RealWorld']
const VALID_TOPICS = [
  'Arrays', 'Strings', 'LinkedList', 'Stack', 'Queue', 'Trees', 'BST', 'Graphs',
  'DynamicProgramming', 'Recursion', 'Sorting', 'Searching', 'Hashing', 'Greedy',
  'Backtracking', 'Trie', 'Heap', 'SystemDesign', 'DatabaseOptimization',
  'APIDesign', 'Scalability', 'Architecture',
]
const VALID_DIFFICULTIES = ['Rookie', 'Warrior', 'Legend']

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// List problems with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { track, topic, difficulty, search, page = '1', limit = '20' } = req.query
    const filter = { isActive: true }

    if (track) {
      const safeTrack = VALID_TRACKS.find((v) => v === track)
      if (!safeTrack) return res.status(400).json({ error: 'Invalid track' })
      filter.track = safeTrack
    }
    if (topic) {
      const safeTopic = VALID_TOPICS.find((v) => v === topic)
      if (!safeTopic) return res.status(400).json({ error: 'Invalid topic' })
      filter.topic = safeTopic
    }
    if (difficulty) {
      const safeDifficulty = VALID_DIFFICULTIES.find((v) => v === difficulty)
      if (!safeDifficulty) return res.status(400).json({ error: 'Invalid difficulty' })
      filter.difficulty = safeDifficulty
    }
    if (search) {
      if (typeof search !== 'string' || search.length > 100) return res.status(400).json({ error: 'Invalid search' })
      filter.title = { $regex: escapeRegex(search), $options: 'i' }
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select('-testCases')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Problem.countDocuments(filter),
    ])

    res.json({
      problems,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
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
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)
    const problem = await Problem.findByIdAndUpdate(safeId, req.body, {
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
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)
    const problem = await Problem.findByIdAndDelete(safeId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json({ message: 'Problem deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
