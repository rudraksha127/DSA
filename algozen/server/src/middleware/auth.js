import { createClerkClient } from '@clerk/backend'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const { sub: clerkId } = await clerkClient.verifyToken(token)

    const user = await User.findOne({ clerkId })
    if (!user) return res.status(401).json({ error: 'User not registered' })

    req.userId = clerkId
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
