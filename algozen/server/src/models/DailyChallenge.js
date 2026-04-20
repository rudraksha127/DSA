import mongoose from 'mongoose'

const dailyChallengeSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  date:      { type: Date, required: true, unique: true },
}, { timestamps: true })

export default mongoose.model('DailyChallenge', dailyChallengeSchema)
