import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const payload = await clerk.verifyToken(token)
    req.clerkId = payload.sub

    const { default: User } = await import('../models/User.js')
    const user = await User.findOne({ clerkId: payload.sub })
    if (!user) return res.status(404).json({ error: 'User not found in DB' })

    req.user = user
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
