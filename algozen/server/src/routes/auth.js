import express, { Router } from 'express'
import { Webhook } from 'svix'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  let evt
  try {
    evt = wh.verify(req.body, {
      'svix-id':        req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    })
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  const { type, data } = evt

  try {
    if (type === 'user.created') {
      await User.create({
        clerkId:  data.id,
        email:    data.email_addresses[0].email_address,
        username: data.username || data.email_addresses[0].email_address.split('@')[0],
        avatar:   data.image_url || '',
      })
    } else if (type === 'user.updated') {
      await User.findOneAndUpdate({ clerkId: data.id }, { avatar: data.image_url })
    } else if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id })
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message)
  }

  res.json({ received: true })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { username } = req.body
    if (username) {
      const existing = await User.findOne({ username })
      if (existing && existing.clerkId !== req.user.clerkId) {
        return res.status(400).json({ error: 'Username already taken' })
      }
      req.user.username = username
      await req.user.save()
    }
    res.json({ user: req.user })
  } catch (err) {
    console.error('PATCH /me error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
