import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

// Routes
import authRoutes from './routes/auth.js'
import problemRoutes from './routes/problems.js'
import submissionRoutes from './routes/submissions.js'
import contestRoutes from './routes/contests.js'
import aiRoutes from './routes/ai.js'
import adminRoutes from './routes/admin.js'

const app = express()

const corsOrigin = process.env.CLIENT_URL || true

app.use(helmet())
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, slow down warrior!' },
  })
)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '⚔️  AlgoZen API is alive',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/contests', contestRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/admin', adminRoutes)

export default app

