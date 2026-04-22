import User from '../models/User.js'

export const updateStreak = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const now      = new Date()
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActive = user.streak.lastActive
    ? new Date(
        user.streak.lastActive.getFullYear(),
        user.streak.lastActive.getMonth(),
        user.streak.lastActive.getDate()
      )
    : null

  let streakBroken = false

  if (!lastActive) {
    user.streak.current = 1
    user.streak.longest = 1
  } else {
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      // Already active today — no change
    } else if (diffDays === 1) {
      user.streak.current += 1
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current
      }
    } else {
      streakBroken = true
      user.streak.current = 1
    }
  }

  user.streak.lastActive = now
  await user.save()

  return {
    current:      user.streak.current,
    longest:      user.streak.longest,
    streakBroken,
  }
}
