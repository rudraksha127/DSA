import { Router } from 'express'
import mongoose from 'mongoose'
import Contest from '../models/Contest.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const VALID_STATUSES = ['draft', 'upcoming', 'live', 'ended']

const router = Router()

// List contests (filter by status)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) {
      const safeStatus = VALID_STATUSES.find((v) => v === status)
      if (!safeStatus) return res.status(400).json({ error: 'Invalid status' })
      filter.status = safeStatus
    }

    const contests = await Contest.find(filter)
      .select('-leaderboard')
      .populate('createdBy', 'username avatar')
      .sort({ startTime: -1 })

    res.json(contests)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single contest
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)
    const contest = await Contest.findById(safeId)
      .populate('problems.problemId', 'title slug difficulty xpReward')
      .populate('createdBy', 'username avatar')

    if (!contest) return res.status(404).json({ error: 'Contest not found' })
    res.json(contest)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create contest (admin only)
router.post('/', requireAuth, adminOnly, async (req, res) => {
  try {
    const contest = await Contest.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json(contest)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Join a contest
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)
    const contest = await Contest.findById(safeId)
    if (!contest) return res.status(404).json({ error: 'Contest not found' })

    if (contest.status === 'ended') {
      return res.status(400).json({ error: 'Contest has ended' })
    }

    const alreadyJoined = contest.participants.some(
      (p) => p.toString() === req.user._id.toString()
    )
    if (alreadyJoined) return res.json({ message: 'Already joined', contest })

    contest.participants.push(req.user._id)
    contest.leaderboard.push({ userId: req.user._id, score: 0, penalty: 0, solved: 0 })
    await contest.save()

    res.json({ message: 'Joined contest', contest })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get contest leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const safeId = new mongoose.Types.ObjectId(req.params.id)
    const contest = await Contest.findById(safeId)
      .select('leaderboard title status')
      .populate('leaderboard.userId', 'username avatar level rank')

    if (!contest) return res.status(404).json({ error: 'Contest not found' })

    const sorted = [...contest.leaderboard].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.penalty - b.penalty
    })

    res.json({ title: contest.title, status: contest.status, leaderboard: sorted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
