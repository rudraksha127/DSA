import { Router } from 'express'
import Problem from '../models/Problem.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { track, difficulty, topic, search, page = 1, limit = 20 } = req.query
    const query = { isActive: true }
    if (track) query.track = track
    if (difficulty) query.difficulty = difficulty
    if (topic) query.topic = topic
    if (search) query.title = { $regex: search, $options: 'i' }

    const total = await Problem.countDocuments(query)
    const problems = await Problem.find(query)
      .select('-testCases -hints -starterCode')
      .sort({ levelRequired: 1, difficulty: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    })
  } catch (err) {
    console.error('GET /problems error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/potd', async (req, res) => {
  try {
    const potd = await Problem.findOne({ isPOTD: true, isActive: true }).select('-testCases')
    if (!potd) return res.json({ problem: null })
    res.json({ problem: potd })
  } catch (err) {
    console.error('GET /problems/potd error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isActive: true }).select('-testCases')
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json({ problem })
  } catch (err) {
    console.error('GET /problems/:slug error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
