import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />} path="/" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
