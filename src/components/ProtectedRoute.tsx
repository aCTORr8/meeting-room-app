import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children?: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          aria-label="Loading"
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
          role="status"
        />
      </div>
    )
  }

  if (!user) {
    return <Navigate replace to="/login" />
  }

  return children ?? <Outlet />
}
