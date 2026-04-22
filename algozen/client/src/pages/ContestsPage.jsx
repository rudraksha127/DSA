import { useState, useEffect } from 'react'
import api from '../lib/api'
import Spinner from '../components/ui/Spinner'
import { Trophy, Clock, Users } from 'lucide-react'

const statusColors = {
  live: 'text-green-400',
  upcoming: 'text-yellow-400',
  ended: 'text-slate-500',
  draft: 'text-slate-600',
}

export default function ContestsPage() {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/contests')
      .then(({ data }) => setContests(data.contests || data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Trophy className="w-8 h-8 text-yellow-400" /> Contests
      </h1>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-4">
          {contests.map(c => (
            <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{c.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(c.startTime).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {c.participants?.length || 0} participants
                  </span>
                </div>
              </div>
              <span className={`font-semibold capitalize ${statusColors[c.status] || 'text-slate-400'}`}>
                {c.status}
              </span>
            </div>
          ))}
          {contests.length === 0 && (
            <p className="text-center text-slate-500 py-20">No contests available</p>
          )}
        </div>
      )}
    </div>
  )
}
