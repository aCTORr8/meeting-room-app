import { createContext } from 'react'
import type { User } from 'firebase/auth'

export interface AuthContextValue {
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  user: User | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
