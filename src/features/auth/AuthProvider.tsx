import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth } from '../../config/auth'
import { AuthContext, type AuthContextValue } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      await updateProfile(credential.user, { displayName: name })
      setUser(credential.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ loading, login, logout, register, user }),
    [loading, login, logout, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
