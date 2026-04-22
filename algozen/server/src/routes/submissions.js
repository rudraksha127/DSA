import { Router } from 'express'
import Submission from '../models/Submission.js'
import Problem from '../models/Problem.js'
import { requireAuth } from '../middleware/auth.js'
import { runTestCases, executeCode } from '../services/judge0.js'
import { awardXP } from '../services/xp.js'
import { updateStreak } from '../services/streak.js'
import { io } from '../index.js'

const router = Router()

router.post('/run', requireAuth, async (req, res) => {
  try {
    const { code, language, problemId, stdin } = req.body

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'code, language, and problemId are required' })
    }

    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const visibleCases = problem.testCases.filter(tc => !tc.isHidden).slice(0, 3)

    if (visibleCases.length === 0 && stdin) {
      const result = await executeCode(code, language, stdin)
      return res.json({
        results: [{ passed: true, input: stdin, got: result.stdout, runtime: result.runtime }],
        customRun: true,
      })
    }

    const results = await runTestCases(code, language, visibleCases)
    res.json({ results })
  } catch (err) {
    console.error('POST /run error:', err.message)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { code, language, problemId } = req.body

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'code, language, and problemId are required' })
    }

    const problem = await Problem.findById(problemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const results    = await runTestCases(code, language, problem.testCases)
    const allPassed  = results.every(r => r.passed)

    const hasCompile = results.some(r => r.status && r.status.toLowerCase().includes('compile'))
    const hasRuntime = results.some(r => r.status && (r.status.toLowerCase().includes('runtime') || r.status === 'Error'))

    let finalStatus = allPassed ? 'Accepted' : 'WrongAnswer'
    if (hasCompile) finalStatus = 'CompileError'
    else if (hasRuntime && !allPassed) finalStatus = 'RuntimeError'

    const maxRuntime = Math.max(...results.map(r => r.runtime || 0))

    const previousAccepted = await Submission.findOne({
      userId:    req.user._id,
      problemId: problem._id,
      status:    'Accepted',
    })
    const isFirstAccepted = allPassed && !previousAccepted

    const submission = await Submission.create({
      userId:    req.user._id,
      problemId: problem._id,
      code,
      language,
      status:    finalStatus,
      runtime:   maxRuntime,
      testResults: results.map(r => ({
        passed:   r.passed,
        input:    r.input,
        expected: r.expected,
        got:      r.got,
        runtime:  r.runtime,
      })),
      isFirstAccepted,
      xpEarned: 0,
    })

    problem.totalSubmissions += 1
    if (allPassed) problem.totalAccepted += 1
    await problem.save()

    let xpResult = null

    if (allPassed) {
      const xpToAward      = isFirstAccepted ? problem.xpReward : Math.floor(problem.xpReward * 0.1)
      submission.xpEarned  = xpToAward
      await submission.save()

      if (isFirstAccepted) {
        req.user.solvedProblems.push(problem._id)
        await req.user.save()
      }

      xpResult = await awardXP(req.user._id, xpToAward, `Solved: ${problem.title}`)
      await updateStreak(req.user._id)

      io.emit('xp-update', {
        userId:    req.user._id,
        xpGained:  xpToAward,
        leveledUp: xpResult.leveledUp,
      })
    }

    res.json({
      submission: {
        id:          submission._id,
        status:      finalStatus,
        runtime:     maxRuntime,
        testResults: results,
        xpEarned:    submission.xpEarned,
      },
      xpResult,
      allPassed,
      totalTests:  results.length,
      passedTests: results.filter(r => r.passed).length,
    })
  } catch (err) {
    console.error('POST /submit error:', err.message)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

router.get('/my', requireAuth, async (req, res) => {
  try {
    const { problemId, page = 1, limit = 20 } = req.query
    const query = { userId: req.user._id }
    if (problemId) query.problemId = problemId

    const submissions = await Submission.find(query)
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ submissions })
  } catch (err) {
    console.error('GET /my error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
