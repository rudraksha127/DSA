import { Router } from 'express'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import { getHint } from '../services/groq.js'

const router = Router()

// Get AI hint for a problem
router.post('/hint', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language, message } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }

    const problem = await Problem.findById(problemId).select('title description')
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const hint = await getHint(problem, { content: code, language }, message)
    res.json({ hint })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
