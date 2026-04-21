import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#6366f1',
              colorBackground: '#111118',
              colorText: '#e2e8f0',
              colorInputBackground: '#1a1a27',
              colorInputText: '#e2e8f0',
              borderRadius: '0.75rem',
            },
            elements: {
              card: 'shadow-2xl shadow-black/40 border border-dark-600',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-400',
              socialButtonsBlockButton:
                'bg-dark-700 border-dark-500 text-slate-200 hover:bg-dark-600',
              formButtonPrimary:
                'bg-primary-600 hover:bg-primary-500 transition-colors',
              footerActionLink: 'text-primary-400 hover:text-primary-300',
            },
          }}
        />
      </div>
    </div>
  )
}
