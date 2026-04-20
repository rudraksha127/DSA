import mongoose from 'mongoose'

const contestSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  startTime: { type: Date, required: true },
  endTime:   { type: Date, required: true },

  problems: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    points:    { type: Number, default: 100 },
    order:     { type: Number, default: 0 },
  }],

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  leaderboard: [{
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score:    { type: Number, default: 0 },
    penalty:  { type: Number, default: 0 }, // minutes
    solved:   { type: Number, default: 0 },
    lastSolveTime: { type: Date },
  }],

  status: {
    type: String,
    enum: ['draft', 'upcoming', 'live', 'ended'],
    default: 'draft'
  },

  isPublic:     { type: Boolean, default: true },
  classroomId:  { type: mongoose.Schema.Types.ObjectId,
                  ref: 'Classroom', default: null },

}, { timestamps: true })

export default mongoose.model('Contest', contestSchema)
