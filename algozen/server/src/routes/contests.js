import { Router } from 'express'
import Contest from '../models/Contest.js'
import { requireAuth } from '../middleware/auth.js'
import { io } from '../index.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    const query = status ? { status } : {}
    const contests = await Contest.find(query)
      .populate('problems.problemId', 'title difficulty xpReward')
      .sort({ startTime: -1 })
      .limit(20)
    res.json({ contests })
  } catch (err) {
    console.error('GET /contests error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('problems.problemId', 'title difficulty xpReward slug')
      .populate('leaderboard.userId', 'username avatar level rank')
    if (!contest) return res.status(404).json({ error: 'Contest not found' })
    res.json({ contest })
  } catch (err) {
    console.error('GET /contests/:id error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
    if (!contest) return res.status(404).json({ error: 'Contest not found' })
    if (contest.status === 'ended') return res.status(400).json({ error: 'Contest has ended' })

    const alreadyRegistered = contest.participants.some(
      p => p.toString() === req.user._id.toString()
    )
    if (!alreadyRegistered) {
      contest.participants.push(req.user._id)
      contest.leaderboard.push({ userId: req.user._id, score: 0, solved: 0 })
      await contest.save()

      io.to(`contest-${contest._id}`).emit('participant-joined', {
        contestId:        contest._id,
        participantCount: contest.participants.length,
      })
    }

    res.json({ registered: true, participantCount: contest.participants.length })
  } catch (err) {
    console.error('POST /contests/:id/register error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id/leaderboard', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('leaderboard.userId', 'username avatar level rank')
      .select('leaderboard title status')
    if (!contest) return res.status(404).json({ error: 'Contest not found' })

    const sorted = [...contest.leaderboard].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (a.penalty || 0) - (b.penalty || 0)
    })

    res.json({ leaderboard: sorted, title: contest.title, status: contest.status })
  } catch (err) {
    console.error('GET /contests/:id/leaderboard error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
