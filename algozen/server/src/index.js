import mongoose from 'mongoose'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const { default: app } = await import('./app.js')

const server = createServer(app)
export const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
})

// ─── Socket.io (Battle Mode + Live Leaderboard) ──────────
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`)

  socket.on('join-user', (userId) => {
    socket.join(userId)
  })

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
const shouldListen = process.env.VERCEL !== '1'

if (shouldListen) {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI')
    process.exit(1)
  }

  mongoose
    .connect(process.env.MONGODB_URI)
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
}
