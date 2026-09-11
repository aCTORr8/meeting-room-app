import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export function Dashboard() {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome to Dashboard
        </h1>
        <Button
          className="mt-8"
          isLoading={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          Logout
        </Button>
      </section>
    </main>
  )
}
