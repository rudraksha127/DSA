import { useParams } from 'react-router-dom'

export default function ProblemSolvePage() {
  const { slug } = useParams()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Problem: {slug}</h1>
      <p className="mt-2 text-slate-400">Code editor and problem statement will appear here.</p>
    </div>
  )
}
