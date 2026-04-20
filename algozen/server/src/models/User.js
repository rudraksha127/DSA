import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId:  { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  avatar:   { type: String, default: '' },
  role:     { type: String, enum: ['student', 'professor', 'admin'],
              default: 'student' },

  // ─── Gamification ────────────────────────────────────
  xp:    { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank:  {
    type: String,
    enum: ['Rookie', 'Warrior', 'Legend', 'Master'],
    default: 'Rookie'
  },

  // ─── Streak ──────────────────────────────────────────
  streak: {
    current:   { type: Number, default: 0 },
    longest:   { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
    freezeUsed: { type: Boolean, default: false },
  },

  // ─── Progress ────────────────────────────────────────
  solvedProblems:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  attemptedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  unlockedLevel:     { type: Number, default: 1 },

  // ─── Creature ────────────────────────────────────────
  creature: {
    stage: { type: Number, default: 0 },
    name:  { type: String, default: 'Algo Egg' },
    xp:    { type: Number, default: 0 },
  },

  // ─── Daily Quests ────────────────────────────────────
  dailyQuests: {
    date:      { type: Date, default: null },
    completed: [{ type: String }],
  },

  // ─── Classroom ───────────────────────────────────────
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom',
                 default: null },

}, { timestamps: true })

// XP → Level calculation
userSchema.methods.calculateLevel = function () {
  const thresholds = [
    0, 100, 250, 450, 700, 1000,   // Levels 1-6
    1400, 1900, 2500, 3200, 4000,  // Levels 7-11
    5000, 6200, 7600, 9200, 11000, // Levels 12-16
  ]
  let level = 1
  for (let i = 0; i < thresholds.length; i++) {
    if (this.xp >= thresholds[i]) level = i + 1
  }

  if (level <= 10) this.rank = 'Rookie'
  else if (level <= 20) this.rank = 'Warrior'
  else if (level <= 35) this.rank = 'Legend'
  else this.rank = 'Master'

  this.level = level
  return level
}

export default mongoose.model('User', userSchema)
