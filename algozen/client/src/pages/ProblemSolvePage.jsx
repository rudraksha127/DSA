import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import {
  ArrowLeft,
  Play,
  Send,
  Loader2,
  ChevronUp,
  ChevronDown,
  Brain,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  MessageSquare,
  Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import useProblemStore from '@/stores/useProblemStore'
import useUserStore from '@/stores/useUserStore'
import api from '@/lib/api'

const MONACO_LANG_MAP = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  javascript: 'javascript',
}

const DIFFICULTY_STYLES = {
  Rookie: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Warrior: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Legend: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

const VERDICT_STYLES = {
  Accepted: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  WrongAnswer: 'bg-red-500/20 text-red-400 border border-red-500/40',
  TimeLimitExceeded: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
}

function getVerdictStyle(verdict) {
  return VERDICT_STYLES[verdict] ?? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
}

export default function ProblemSolvePage() {
  const { slug } = useParams()
  const { currentProblem: problem, loading, fetchProblem } = useProblemStore()
  const { updateXP } = useUserStore()

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [runResults, setRunResults] = useState(null)
  const [submitResult, setSubmitResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const [aiTab, setAiTab] = useState('hints')
  const [aiHint, setAiHint] = useState('')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiReview, setAiReview] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const runFnRef = useRef(null)
  const submitFnRef = useRef(null)

  useEffect(() => {
    fetchProblem(slug)
  }, [slug])

  useEffect(() => {
    if (problem) {
      const langs = problem.supportedLanguages ?? ['python']
      const defaultLang = langs.includes('python') ? 'python' : langs[0]
      setLanguage(defaultLang)
      setCode(problem.starterCode?.[defaultLang] ?? '')
    }
  }, [problem?._id])

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode?.[language] ?? '')
    }
  }, [language])

  const handleRun = useCallback(async () => {
    if (!problem || isRunning) return
    setIsRunning(true)
    try {
      const { data } = await api.post('/submissions/run', {
        code,
        language,
        problemId: problem._id,
      })
      setRunResults(data.results ?? [])
      setSubmitResult(null)
      setBottomPanelOpen(true)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Run failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }, [problem, code, language, isRunning])

  const handleSubmit = useCallback(async () => {
    if (!problem || isSubmitting) return
    setIsSubmitting(true)
    try {
      const { data } = await api.post('/submissions/submit', {
        code,
        language,
        problemId: problem._id,
      })
      setSubmitResult(data)
      setRunResults(null)
      setBottomPanelOpen(true)
      if (data.verdict === 'Accepted') {
        toast.success(
          data.xpEarned
            ? `✅ Accepted! +${data.xpEarned} XP`
            : '✅ Accepted!'
        )
        if (data.xpEarned && data.submission) {
          updateXP(
            data.submission.xp ?? 0,
            data.submission.level ?? 1,
            data.submission.rank ?? 'Rookie'
          )
        }
      } else {
        toast.error(data.verdict ?? 'Submission failed')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [problem, code, language, isSubmitting, updateXP])

  useEffect(() => {
    runFnRef.current = handleRun
    submitFnRef.current = handleSubmit
  }, [handleRun, handleSubmit])

  function handleEditorMount(editor, monaco) {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runFnRef.current?.()
    })
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        submitFnRef.current?.()
      }
    )
  }

  const handleAIHint = async () => {
    if (!problem || aiLoading) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/hint', { problemId: problem._id })
      setAiHint(data.hint ?? '')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to get hint')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAIAsk = async () => {
    if (!problem || !aiQuestion.trim() || aiLoading) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/hint', {
        problemId: problem._id,
        question: aiQuestion,
      })
      setAiAnswer(data.hint ?? data.answer ?? '')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to get answer')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAIReview = async () => {
    if (!problem || aiLoading) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/review', {
        code,
        language,
        problemId: problem._id,
      })
      setAiReview(data.review ?? '')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to get review')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-dark-900 text-slate-300">
        <p className="text-lg">Problem not found.</p>
        <Link
          to="/problems"
          className="flex items-center gap-1 text-primary-500 hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>
      </div>
    )
  }

  const passCount = runResults ? runResults.filter((r) => r.passed).length : 0
  const totalCount = runResults ? runResults.length : 0

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-900">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-dark-600 bg-dark-800 px-4 py-2 flex-shrink-0 h-14 gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Back</span>
          </Link>
          <span className="text-dark-600 hidden sm:block">|</span>
          <h1 className="font-semibold text-white truncate text-sm sm:text-base">
            {problem.title}
          </h1>
          <span
            className={clsx(
              'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              DIFFICULTY_STYLES[problem.difficulty] ?? 'bg-slate-700 text-slate-300'
            )}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Center: language selector (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-dark-600 bg-dark-700 px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
          >
            {(problem.supportedLanguages ?? ['python']).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Run</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </header>

      {/* ── Main Area ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Pane: Problem Description */}
        <div className="hidden md:flex flex-col overflow-hidden flex-1 min-w-0">
          {/* Tab Bar */}
          <div className="flex border-b border-dark-600 bg-dark-800 flex-shrink-0">
            {['description', 'examples', 'hints', 'editorial'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-4 py-3 text-sm font-medium capitalize transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-primary-500 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-dark-500">
            {activeTab === 'description' && (
              <DescriptionTab problem={problem} />
            )}
            {activeTab === 'examples' && (
              <ExamplesTab examples={problem.examples ?? []} />
            )}
            {activeTab === 'hints' && (
              <HintsTab
                hints={problem.hints ?? []}
                revealedHints={revealedHints}
                setRevealedHints={setRevealedHints}
              />
            )}
            {activeTab === 'editorial' && <EditorialTab />}
          </div>
        </div>

        {/* Static Divider */}
        <div className="hidden md:block w-1 bg-dark-600 cursor-col-resize flex-shrink-0" />

        {/* Right Pane: Editor */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile language selector */}
          <div className="flex md:hidden items-center justify-between border-b border-dark-600 bg-dark-800 px-3 py-2 flex-shrink-0">
            <span className="text-xs text-slate-400">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border border-dark-600 bg-dark-700 px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {(problem.supportedLanguages ?? ['python']).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={MONACO_LANG_MAP[language] ?? 'python'}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                tabSize: 2,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* AI Sidebar Toggle Button */}
        <button
          onClick={() => setAiOpen((v) => !v)}
          className="absolute right-0 top-4 z-20 flex items-center justify-center rounded-l-lg bg-accent-500 p-2 text-white shadow-lg hover:bg-accent-600 transition-colors"
          title="AlgoGuru AI"
        >
          {aiOpen ? <X className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
        </button>

        {/* AI Sidebar */}
        <AnimatePresence>
          {aiOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 z-10 w-80 border-l border-dark-600 bg-dark-800 flex flex-col shadow-2xl"
            >
              {/* AI Header */}
              <div className="flex items-center justify-between border-b border-dark-600 px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent-500" />
                  <span className="font-semibold text-white text-sm">AlgoGuru AI</span>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* AI Tabs */}
              <div className="flex border-b border-dark-600 flex-shrink-0">
                {[
                  { id: 'hints', label: 'Hints', icon: Lightbulb },
                  { id: 'ask', label: 'Ask AI', icon: MessageSquare },
                  { id: 'review', label: 'Review', icon: Eye },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setAiTab(id)}
                    className={clsx(
                      'flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
                      aiTab === id
                        ? 'border-b-2 border-accent-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* AI Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiTab === 'hints' && (
                  <AiHintsTab
                    hint={aiHint}
                    loading={aiLoading}
                    onGetHint={handleAIHint}
                  />
                )}
                {aiTab === 'ask' && (
                  <AiAskTab
                    question={aiQuestion}
                    setQuestion={setAiQuestion}
                    answer={aiAnswer}
                    loading={aiLoading}
                    onAsk={handleAIAsk}
                  />
                )}
                {aiTab === 'review' && (
                  <AiReviewTab
                    review={aiReview}
                    loading={aiLoading}
                    onReview={handleAIReview}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Panel ────────────────────────────────────────── */}
      <div
        className={clsx(
          'flex-shrink-0 border-t border-dark-600 bg-dark-800 transition-all duration-200',
          bottomPanelOpen ? 'h-48' : 'h-10'
        )}
      >
        {/* Panel Header */}
        <div className="flex h-10 items-center justify-between border-b border-dark-600 px-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">
              {submitResult
                ? 'Submit Result'
                : runResults
                ? `Test Cases: ${passCount}/${totalCount} passed`
                : 'Test Results'}
            </span>
            {runResults && (
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  passCount === totalCount && totalCount > 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                )}
              >
                {passCount === totalCount && totalCount > 0 ? 'All Passed' : 'Some Failed'}
              </span>
            )}
            {submitResult && (
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  getVerdictStyle(submitResult.verdict)
                )}
              >
                {submitResult.verdict}
              </span>
            )}
          </div>
          <button
            onClick={() => setBottomPanelOpen((v) => !v)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {bottomPanelOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Panel Body */}
        {bottomPanelOpen && (
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-3 space-y-2">
            {submitResult && (
              <div
                className={clsx(
                  'rounded-lg p-3 text-sm font-medium',
                  getVerdictStyle(submitResult.verdict)
                )}
              >
                <div className="flex items-center gap-2">
                  {submitResult.verdict === 'Accepted' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>{submitResult.verdict}</span>
                  {submitResult.xpEarned > 0 && (
                    <span className="ml-auto text-emerald-400 font-semibold">
                      +{submitResult.xpEarned} XP
                    </span>
                  )}
                </div>
                {submitResult.message && (
                  <p className="mt-1 text-xs opacity-80">{submitResult.message}</p>
                )}
              </div>
            )}

            {runResults && runResults.length > 0 && (
              <div className="space-y-2">
                {runResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'rounded-lg border p-3 text-xs',
                      result.passed
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-200">
                        Test Case {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {result.runtime && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3 w-3" />
                            {result.runtime}
                          </span>
                        )}
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-slate-500 uppercase font-medium mb-1">Input</p>
                        <pre className="rounded bg-dark-900 p-1.5 text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
                          {result.input ?? '—'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase font-medium mb-1">Expected</p>
                        <pre className="rounded bg-dark-900 p-1.5 text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
                          {result.expected ?? '—'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase font-medium mb-1">Got</p>
                        <pre
                          className={clsx(
                            'rounded p-1.5 overflow-x-auto whitespace-pre-wrap break-all',
                            result.passed
                              ? 'bg-dark-900 text-emerald-300'
                              : 'bg-dark-900 text-red-300'
                          )}
                        >
                          {result.got ?? '—'}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!runResults && !submitResult && (
              <p className="text-slate-500 text-sm text-center py-4">
                Run your code to see results here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────────────────── */

function DescriptionTab({ problem }) {
  return (
    <div className="space-y-4">
      <p className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
        {problem.description}
      </p>
      {problem.constraints && (
        <div className="space-y-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
            Constraints:
          </p>
          <pre className="bg-dark-700 rounded p-3 font-mono text-sm text-slate-300 whitespace-pre-wrap">
            {problem.constraints}
          </pre>
        </div>
      )}
    </div>
  )
}

function ExamplesTab({ examples }) {
  if (!examples.length) {
    return (
      <p className="text-slate-500 text-sm text-center py-8">No examples available.</p>
    )
  }
  return (
    <div className="space-y-3">
      {examples.map((ex, idx) => (
        <div key={idx} className="bg-dark-700 rounded-lg p-4 space-y-2">
          <p className="text-slate-300 text-xs font-semibold">Example {idx + 1}</p>
          <div className="space-y-2">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase mb-1">Input:</p>
              <pre className="bg-dark-800 rounded p-2 font-mono text-sm text-slate-200 whitespace-pre-wrap">
                {ex.input}
              </pre>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase mb-1">Output:</p>
              <pre className="bg-dark-800 rounded p-2 font-mono text-sm text-slate-200 whitespace-pre-wrap">
                {ex.output}
              </pre>
            </div>
            {ex.explanation && (
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase mb-1">
                  Explanation:
                </p>
                <div className="bg-dark-800 rounded p-2 font-mono text-sm text-slate-200">
                  {ex.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function HintsTab({ hints, revealedHints, setRevealedHints }) {
  if (!hints.length) {
    return (
      <p className="text-slate-500 text-sm text-center py-8">No hints available.</p>
    )
  }
  return (
    <div className="space-y-3">
      {hints.map((hint, idx) => {
        if (idx < revealedHints) {
          return (
            <div key={idx} className="bg-dark-700 rounded-lg p-4 text-slate-300 text-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                Hint {idx + 1}
              </p>
              <p>{hint}</p>
            </div>
          )
        }
        if (idx === revealedHints) {
          return (
            <button
              key={idx}
              onClick={() => setRevealedHints((v) => v + 1)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-dark-500 p-3 text-sm text-slate-400 hover:border-primary-500 hover:text-primary-400 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Reveal Hint {idx + 1}
            </button>
          )
        }
        return null
      })}
      {revealedHints >= hints.length && (
        <p className="text-center text-xs text-slate-500 py-2">
          All hints revealed ✓
        </p>
      )}
    </div>
  )
}

function EditorialTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <span className="text-4xl">📝</span>
      <p className="text-slate-400 text-sm">Editorial coming soon</p>
      <p className="text-slate-600 text-xs">
        Check back after solving the problem!
      </p>
    </div>
  )
}

function AiHintsTab({ hint, loading, onGetHint }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        Get an AI-generated hint tailored to this problem.
      </p>
      <button
        onClick={onGetHint}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="h-4 w-4" />
        )}
        Get Hint
      </button>
      {hint && (
        <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed">
          {hint}
        </div>
      )}
    </div>
  )
}

function AiAskTab({ question, setQuestion, answer, loading, onAsk }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">Ask anything about this problem.</p>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What data structure should I use?"
        rows={3}
        className="w-full rounded-lg border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-500 resize-none"
      />
      <button
        onClick={onAsk}
        disabled={loading || !question.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        Ask
      </button>
      {answer && (
        <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  )
}

function AiReviewTab({ review, loading, onReview }) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        Get AI feedback on your current code.
      </p>
      <button
        onClick={onReview}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500/20 border border-accent-500/30 px-3 py-2 text-sm text-accent-400 hover:bg-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        Review My Code
      </button>
      {review && (
        <div className="rounded-lg bg-dark-700 p-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {review}
        </div>
      )}
    </div>
  )
}
