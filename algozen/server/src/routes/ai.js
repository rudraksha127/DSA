import { Router } from 'express'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import { getHint, reviewCode, explainSolution } from '../services/groq.js'

const router = Router()

router.post('/hint', requireAuth, async (req, res) => {
  try {
    const { problemId, code, hintLevel = 1 } = req.body
    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const hint = await getHint(problem, code, hintLevel)
    res.json({ hint })
  } catch (err) {
    console.error('POST /hint error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/review', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const review = await reviewCode(problem, code, language)
    res.json({ review })
  } catch (err) {
    console.error('POST /review error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/explain', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const explanation = await explainSolution(problem, code, language)
    res.json({ explanation })
  } catch (err) {
    console.error('POST /explain error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
