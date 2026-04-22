import { useEffect } from 'react'
import { useAuth, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import useAuthStore from '../store/useAuthStore'
import api from '../lib/api'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { Zap, Flame, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { getToken } = useAuth()
  const { user, loading, fetchUser } = useAuthStore()

  useEffect(() => {
    getToken().then(token => {
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : user ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <div className="flex gap-2 mt-1">
                  <Badge label={user.rank} variant={user.rank} />
                  <Badge label={`Level ${user.level}`} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatCard icon={<Zap className="w-6 h-6 text-yellow-400" />} label="XP" value={user.xp} />
              <StatCard icon={<Flame className="w-6 h-6 text-orange-400" />} label="Streak" value={`${user.streak?.current || 0} days`} />
              <StatCard icon={<CheckCircle className="w-6 h-6 text-green-400" />} label="Solved" value={user.solvedProblems?.length || 0} />
            </div>
          </div>
        ) : (
          <p className="text-center py-20 text-slate-500">
            Could not load profile. Please make sure you are registered.
          </p>
        )}
      </SignedIn>
    </>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}
