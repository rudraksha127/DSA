import express      from 'express'
import cors         from 'cors'
import helmet       from 'helmet'
import morgan       from 'morgan'
import mongoose     from 'mongoose'
import { createServer } from 'http'
import { Server }   from 'socket.io'
import dotenv       from 'dotenv'
import rateLimit    from 'express-rate-limit'

// Routes
import authRoutes        from './routes/auth.js'
import problemRoutes     from './routes/problems.js'
import submissionRoutes  from './routes/submissions.js'
import contestRoutes     from './routes/contests.js'
import aiRoutes          from './routes/ai.js'
import adminRoutes       from './routes/admin.js'

dotenv.config()

const app    = express()
const server = createServer(app)
export const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
})

// ─── Middleware ───────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests, slow down warrior!' }
}))

// ─── Routes ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:    'OK',
    message:   '⚔️  AlgoZen API is alive',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/auth',        authRoutes)
app.use('/api/problems',    problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/contests',    contestRoutes)
app.use('/api/ai',          aiRoutes)
app.use('/api/admin',       adminRoutes)

// ─── Socket.io (Battle Mode + Live Leaderboard) ──────────
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`)

  socket.on('join-contest', (contestId) => {
    socket.join(`contest-${contestId}`)
  })

  socket.on('join-battle', (battleId) => {
    socket.join(`battle-${battleId}`)
  })

  socket.on('disconnect', () => {
    console.log(`💤 User disconnected: ${socket.id}`)
  })
})

// ─── MongoDB + Server Start ───────────────────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🍃 MongoDB connected')
    server.listen(PORT, () => {
      console.log(`🚀 AlgoZen server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  })
