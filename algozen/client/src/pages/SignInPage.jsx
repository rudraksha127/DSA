import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          AlgoZen
        </h1>
        <p className="mt-1 text-slate-400 text-sm">Welcome back, coder.</p>
      </div>
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}
