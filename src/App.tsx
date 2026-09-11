import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FullPageLoader } from './components/ui/FullPageLoader'

const Dashboard = lazy(async () => {
  const page = await import('./pages/Dashboard')
  return { default: page.Dashboard }
})

const Login = lazy(async () => {
  const page = await import('./pages/Login')
  return { default: page.Login }
})

const Register = lazy(async () => {
  const page = await import('./pages/Register')
  return { default: page.Register }
})

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader label="Loading page" />}>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ProtectedRoute />}>
            <Route element={<Dashboard />} path="/" />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
