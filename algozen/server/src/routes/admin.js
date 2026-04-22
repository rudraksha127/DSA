import { Router } from 'express'
import Problem from '../models/Problem.js'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

router.use(requireAuth, adminOnly)

router.get('/stats', async (req, res) => {
  try {
    const [userCount, problemCount] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
    ])
    res.json({ userCount, problemCount })
  } catch (err) {
    console.error('GET /admin/stats error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/problems', async (req, res) => {
  try {
    const problem = await Problem.create(req.body)
    res.status(201).json({ problem })
  } catch (err) {
    console.error('POST /admin/problems error:', err.message)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

router.patch('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!problem) return res.status(404).json({ error: 'Problem not found' })
    res.json({ problem })
  } catch (err) {
    console.error('PATCH /admin/problems/:id error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/problems/:id', async (req, res) => {
  try {
    await Problem.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true })
  } catch (err) {
    console.error('DELETE /admin/problems/:id error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
