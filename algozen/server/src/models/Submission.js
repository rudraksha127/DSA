import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', default: null },

  // ─── Code ────────────────────────────────────────────
  code:     { type: String, required: true },
  language: {
    type: String,
    enum: ['cpp', 'java', 'python', 'javascript'],
    required: true
  },

  // ─── Result ──────────────────────────────────────────
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'WrongAnswer',
           'TimeLimitExceeded', 'RuntimeError',
           'CompileError', 'MemoryLimitExceeded'],
    default: 'Pending'
  },

  runtime:  { type: Number, default: 0 },  // ms
  memory:   { type: Number, default: 0 },  // KB
  xpEarned: { type: Number, default: 0 },

  // ─── Test Case Results ───────────────────────────────
  testResults: [{
    passed: Boolean,
    input:  String,
    expected: String,
    got:    String,
    runtime: Number,
  }],

  isFirstAccepted: { type: Boolean, default: false },

}, { timestamps: true })

export default mongoose.model('Submission', submissionSchema)
