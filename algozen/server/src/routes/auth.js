import { Router } from 'express'
import { Webhook } from 'svix'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Register user (called after Clerk signup)
router.post('/register', async (req, res) => {
  try {
    const { clerkId, username, email, avatar } = req.body
    if (!clerkId || !username || !email) {
      return res.status(400).json({ error: 'clerkId, username, email required' })
    }
    const existing = await User.findOne({ clerkId })
    if (existing) return res.json(existing)

    const user = await User.create({ clerkId, username, email, avatar: avatar || '' })
    res.status(201).json(user)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username or email already taken' })
    }
    res.status(500).json({ error: err.message })
  }
})

// Get current user
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { username, avatar } = req.body
    const updates = {}
    if (username) updates.username = username
    if (avatar !== undefined) updates.avatar = avatar

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json(user)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Username already taken' })
    res.status(500).json({ error: err.message })
  }
})

// Clerk webhook
router.post('/webhook', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: 'No webhook secret configured' })

  const headers = {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature'],
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    const payload = JSON.stringify(req.body)
    const evt = wh.verify(payload, headers)

    if (evt.type === 'user.created') {
      const { id, email_addresses, username, image_url } = evt.data
      const email = email_addresses[0]?.email_address || ''
      const uname = username || email.split('@')[0]
      await User.create({ clerkId: id, username: uname, email, avatar: image_url || '' }).catch(() => {})
    }

    if (evt.type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: evt.data.id })
    }

    res.json({ received: true })
  } catch (err) {
    res.status(400).json({ error: 'Webhook verification failed' })
  }
})

export default router
