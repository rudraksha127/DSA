import { Router } from 'express'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import Submission from '../models/Submission.js'
import { requireAuth } from '../middleware/auth.js'
import { submitCode } from '../services/judge0.js'
import { awardXP, updateStreak } from '../services/xp.js'
import { io } from '../index.js'

const VALID_LANGUAGES = ['cpp', 'java', 'python', 'javascript']

const router = Router()

// Run code against visible test cases (no submission saved)
router.post('/run', requireAuth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) return res.status(400).json({ error: 'Invalid problemId' })
    const safeLanguage = VALID_LANGUAGES.find((l) => l === language)
    if (!safeLanguage) return res.status(400).json({ error: 'Invalid language' })

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden)
    const results = await submitCode(code, safeLanguage, visibleTestCases)
    res.json({ results })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Submit code (alias POST / — keeps route name explicit for clients)
// (kept for clients that POST /submissions/submit explicitly)

async function handleSubmit(req, res) {
  try {
    const { problemId, code, language, contestId } = req.body
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, language required' })
    }
    if (!mongoose.isValidObjectId(problemId)) return res.status(400).json({ error: 'Invalid problemId' })
    const safeLanguage = VALID_LANGUAGES.find((l) => l === language)
    if (!safeLanguage) return res.status(400).json({ error: 'Invalid language' })

    const safeProblemId = new mongoose.Types.ObjectId(problemId)
    const problem = await Problem.findById(safeProblemId)
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    if (!problem.supportedLanguages.includes(safeLanguage)) {
      return res.status(400).json({ error: `Language ${safeLanguage} not supported for this problem` })
    }

    // Run against visible test cases only
    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden)
    const testResults = await submitCode(code, safeLanguage, visibleTestCases)

    const allPassed = testResults.every((r) => r.passed)
    const status = allPassed ? 'Accepted' : 'WrongAnswer'
    const avgRuntime = testResults.reduce((s, r) => s + r.runtime, 0) / (testResults.length || 1)
    const maxMemory = Math.max(...testResults.map((r) => r.memory), 0)

    // Check if first accepted
    const previousAccepted = await Submission.findOne({
      userId: req.user._id,
      problemId: safeProblemId,
      status: 'Accepted',
    })
    const isFirstAccepted = allPassed && !previousAccepted

    let xpEarned = 0
    if (isFirstAccepted) {
      xpEarned = problem.xpReward
      await awardXP(req.user._id, xpEarned)
      await updateStreak(req.user._id)

      // Track solved problem
      await req.user.updateOne({
        $addToSet: { solvedProblems: problem._id },
      })
    } else if (!previousAccepted) {
      // Track attempted problem
      await req.user.updateOne({
        $addToSet: { attemptedProblems: problem._id },
      })
    }

    // Update problem stats
    await Problem.findByIdAndUpdate(safeProblemId, {
      $inc: {
        totalSubmissions: 1,
        ...(allPassed ? { totalAccepted: 1 } : {}),
      },
    })

    const safeContestId =
      contestId && mongoose.isValidObjectId(contestId)
        ? new mongoose.Types.ObjectId(contestId)
        : null

    const submission = await Submission.create({
      userId: req.user._id,
      problemId: safeProblemId,
      contestId: safeContestId,
      code,
      language: safeLanguage,
      status,
      runtime: Math.round(avgRuntime),
      memory: maxMemory,
      xpEarned,
      testResults,
      isFirstAccepted,
    })

    // Emit real-time result to user
    io.to(req.user._id.toString()).emit('submission-result', {
      submissionId: submission._id,
      status,
      xpEarned,
      isFirstAccepted,
    })

    res.status(201).json(submission)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

router.post('/',       requireAuth, handleSubmit)
router.post('/submit', requireAuth, handleSubmit)

// Get current user's submissions (paginated)
router.get('/my', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [submissions, total] = await Promise.all([
      Submission.find({ userId: req.user._id })
        .populate('problemId', 'title slug difficulty')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Submission.countDocuments({ userId: req.user._id }),
    ])

    res.json({ submissions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user's submissions for a specific problem
router.get('/problem/:problemId', requireAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
      problemId: req.params.problemId,
    }).sort({ createdAt: -1 })

    res.json(submissions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
