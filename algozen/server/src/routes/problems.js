import { Router } from 'express'
import Problem from '../models/Problem.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { track, difficulty, topic, search, page = 1, limit = 20 } = req.query
    const query = { isActive: true }

    const VALID_TRACKS = ['DSA', 'RealWorld']
    const VALID_DIFFICULTIES = ['Rookie', 'Warrior', 'Legend']
    const VALID_TOPICS = [
      'Arrays', 'Strings', 'LinkedList', 'Stack', 'Queue', 'Trees', 'BST',
      'Graphs', 'DynamicProgramming', 'Recursion', 'Sorting', 'Searching',
      'Hashing', 'Greedy', 'Backtracking', 'Trie', 'Heap',
      'SystemDesign', 'DatabaseOptimization', 'APIDesign', 'Scalability', 'Architecture',
    ]

    if (track && typeof track === 'string' && VALID_TRACKS.includes(track)) query.track = track
    if (difficulty && typeof difficulty === 'string' && VALID_DIFFICULTIES.includes(difficulty)) query.difficulty = difficulty
    if (topic && typeof topic === 'string' && VALID_TOPICS.includes(topic)) query.topic = topic
    if (search && typeof search === 'string') query.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }

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
