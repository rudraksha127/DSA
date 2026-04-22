import User from '../models/User.js'

export const awardXP = async (userId, amount) => {
  const user = await User.findById(userId)
  if (!user) return null
  user.xp += amount
  user.calculateLevel()
  await user.save()
  return user
}

export const updateStreak = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActive = user.streak.lastActive ? new Date(user.streak.lastActive) : null
  if (lastActive) lastActive.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (!lastActive) {
    user.streak.current = 1
  } else if (lastActive.getTime() === today.getTime()) {
    // already active today, no change
  } else if (lastActive.getTime() === yesterday.getTime()) {
    user.streak.current += 1
  } else {
    user.streak.current = 1
  }

  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current
  }
  user.streak.lastActive = today
  await user.save()
  return user
}
