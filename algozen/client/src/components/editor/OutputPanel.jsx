import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

const statusIcons = {
  Accepted: <CheckCircle className="w-5 h-5 text-green-400" />,
  WrongAnswer: <XCircle className="w-5 h-5 text-red-400" />,
  TimeLimitExceeded: <Clock className="w-5 h-5 text-yellow-400" />,
  RuntimeError: <AlertCircle className="w-5 h-5 text-orange-400" />,
  CompileError: <AlertCircle className="w-5 h-5 text-red-400" />,
  Pending: <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />,
}

export default function OutputPanel({ submission, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-2 text-slate-400">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span>Running your code...</span>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Submit your code to see results
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto h-full">
      <div className="flex items-center gap-2">
        {statusIcons[submission.status] || statusIcons.RuntimeError}
        <span className={`font-semibold ${submission.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
          {submission.status}
        </span>
        {submission.xpEarned > 0 && (
          <span className="ml-auto text-yellow-400 text-sm">+{submission.xpEarned} XP</span>
        )}
      </div>

      {submission.testResults?.map((t, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg border text-sm ${t.passed ? 'border-green-800 bg-green-950/30' : 'border-red-800 bg-red-950/30'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            {t.passed
              ? <CheckCircle className="w-4 h-4 text-green-400" />
              : <XCircle className="w-4 h-4 text-red-400" />}
            <span className="font-medium">Test Case {i + 1}</span>
          </div>
          {!t.passed && (
            <>
              <p className="text-slate-400">Input: <code className="text-slate-200">{t.input}</code></p>
              <p className="text-slate-400">Expected: <code className="text-green-300">{t.expected}</code></p>
              <p className="text-slate-400">Got: <code className="text-red-300">{t.got}</code></p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
