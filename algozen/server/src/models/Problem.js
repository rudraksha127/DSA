import mongoose from 'mongoose'

const testCaseSchema = new mongoose.Schema({
  input:       { type: String, required: true },
  output:      { type: String, required: true },
  explanation: { type: String, default: '' },
  isHidden:    { type: Boolean, default: false },
})

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true }, // Markdown

  // ─── Classification ──────────────────────────────────
  track: {
    type: String,
    enum: ['DSA', 'RealWorld'],
    required: true
  },
  topic: {
    type: String,
    enum: [
      // DSA Topics
      'Arrays', 'Strings', 'LinkedList', 'Stack',
      'Queue', 'Trees', 'BST', 'Graphs', 'DynamicProgramming',
      'Recursion', 'Sorting', 'Searching', 'Hashing',
      'Greedy', 'Backtracking', 'Trie', 'Heap',
      // RealWorld Topics
      'SystemDesign', 'DatabaseOptimization',
      'APIDesign', 'Scalability', 'Architecture'
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Rookie', 'Warrior', 'Legend'],
    required: true
  },

  // ─── Unlock System ───────────────────────────────────
  levelRequired: { type: Number, default: 1 },
  xpReward:      { type: Number, required: true },

  // ─── Problem Content ─────────────────────────────────
  constraints:    { type: String, default: '' },
  examples:       [{ input: String, output: String, explanation: String }],
  testCases:      [testCaseSchema],
  hints:          [{ type: String }],
  editorialLink:  { type: String, default: '' },

  // ─── Metadata ────────────────────────────────────────
  source: {
    type: String,
    enum: ['original', 'codeforces', 'usaco', 'community'],
    default: 'original'
  },
  sourceId: { type: String, default: '' },

  // ─── Stats ───────────────────────────────────────────
  totalSubmissions: { type: Number, default: 0 },
  totalAccepted:    { type: Number, default: 0 },
  isActive:         { type: Boolean, default: true },
  isPOTD:           { type: Boolean, default: false },

  // ─── Supported Languages ─────────────────────────────
  supportedLanguages: {
    type: [String],
    default: ['cpp', 'java', 'python', 'javascript']
  },

  // ─── Starter Code ────────────────────────────────────
  starterCode: {
    cpp:        { type: String, default: '' },
    java:       { type: String, default: '' },
    python:     { type: String, default: '' },
    javascript: { type: String, default: '' },
  },

}, { timestamps: true })

// Acceptance rate virtual
problemSchema.virtual('acceptanceRate').get(function () {
  if (this.totalSubmissions === 0) return 0
  return Math.round((this.totalAccepted / this.totalSubmissions) * 100)
})

export default mongoose.model('Problem', problemSchema)
