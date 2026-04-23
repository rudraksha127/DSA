export default function FilterBar({ filters, onChange }) {
  const difficulties = ['Rookie', 'Warrior', 'Legend']
  const tracks = ['DSA', 'RealWorld']

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={filters.difficulty || ''}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Difficulties</option>
        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select
        value={filters.track || ''}
        onChange={(e) => onChange({ ...filters, track: e.target.value })}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
      >
        <option value="">All Tracks</option>
        {tracks.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        type="text"
        placeholder="Search problems..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-w-[200px]"
      />
    </div>
  )
}
