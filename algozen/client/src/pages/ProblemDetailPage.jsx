import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import CodeEditor from '../components/editor/CodeEditor'
import OutputPanel from '../components/editor/OutputPanel'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { Lightbulb, Send } from 'lucide-react'

const LANGUAGES = ['javascript', 'python', 'cpp', 'java']

export default function ProblemDetailPage() {
  const { slug } = useParams()
  const { getToken } = useAuth()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)
  const [hint, setHint] = useState('')
  const [hintLoading, setHintLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    api.get(`/api/problems/${slug}`)
      .then(({ data }) => { setProblem(data); setCode(data.starterCode?.[language] || '') })
      .catch(() => toast.error('Problem not found'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    if (problem) setCode(problem.starterCode?.[language] || code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Write some code first!')
    setSubmitting(true)
    setSubmission(null)
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/submissions',
        { problemId: problem._id, code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSubmission(data)
      if (data.status === 'Accepted') toast.success('Accepted! 🎉')
      else toast.error(data.status)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHint = async () => {
    setHintLoading(true)
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/ai/hint',
        { problemId: problem._id, code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setHint(data.hint)
      setActiveTab('hint')
    } catch {
      toast.error('Could not get hint')
    } finally {
      setHintLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!problem) return <p className="text-center py-20 text-slate-500">Problem not found</p>

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left: Problem */}
      <div className="w-2/5 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-800">
          {['description', 'hints', 'hint'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm capitalize ${activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400'}`}
            >
              {tab === 'hint' ? 'AI Hint' : tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'description' && (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <Badge label={problem.difficulty} variant={problem.difficulty} />
                <Badge label={problem.topic} />
              </div>
              <p className="text-slate-300 whitespace-pre-wrap text-sm">{problem.description}</p>
              {problem.examples?.map((ex, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium">Example {i + 1}</p>
                  <p className="text-slate-400">Input: <code className="text-slate-200">{ex.input}</code></p>
                  <p className="text-slate-400">Output: <code className="text-slate-200">{ex.output}</code></p>
                  {ex.explanation && <p className="text-slate-500">Explanation: {ex.explanation}</p>}
                </div>
              ))}
              {problem.constraints && (
                <div>
                  <p className="font-medium mb-1">Constraints:</p>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap">{problem.constraints}</p>
                </div>
              )}
            </>
          )}
          {activeTab === 'hints' && (
            <div className="space-y-2">
              {problem.hints?.length ? problem.hints.map((h, i) => (
                <details key={i} className="bg-slate-800 rounded-lg">
                  <summary className="p-3 cursor-pointer text-sm">Hint {i + 1}</summary>
                  <p className="px-3 pb-3 text-slate-400 text-sm">{h}</p>
                </details>
              )) : <p className="text-slate-500">No hints available</p>}
            </div>
          )}
          {activeTab === 'hint' && (
            <div className="space-y-3">
              {hintLoading ? <Spinner /> : hint ? (
                <div className="bg-indigo-950/40 border border-indigo-800 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap">
                  {hint}
                </div>
              ) : (
                <p className="text-slate-500">Click the AI Hint button to get a hint</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Editor + Output */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onClick={handleHint} disabled={hintLoading}>
              <Lightbulb className="w-4 h-4 mr-1" />
              AI Hint
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              <Send className="w-4 h-4 mr-1" />
              {submitting ? 'Running...' : 'Submit'}
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <OutputPanel submission={submission} loading={submitting} />
        </div>
      </div>
    </div>
  )
}
