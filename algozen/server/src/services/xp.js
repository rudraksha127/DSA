import User from '../models/User.js'

export const awardXP = async (userId, amount, reason = '') => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const prevLevel = user.level
  user.xp += amount
  user.creature.xp += amount
  user.calculateLevel()

  const newStage  = Math.min(Math.floor(user.level / 5), 4)
  const evolved   = newStage > user.creature.stage
  if (evolved) {
    user.creature.stage = newStage
    const stageNames = ['Algo Egg', 'Baby Coder', 'Code Lizard', 'Algorithm Dragon', 'Legend Beast']
    user.creature.name = stageNames[newStage]
  }

  await user.save()

  return {
    user,
    xpGained: amount,
    prevLevel,
    newLevel:  user.level,
    leveledUp: user.level > prevLevel,
    evolved,
    reason,
  }
}
