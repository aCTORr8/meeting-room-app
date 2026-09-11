import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { RoomRole } from '../../../types'

interface AccessFormProps {
  isUpdating: boolean
  onSubmit: (email: string, role: RoomRole['role']) => Promise<void>
}

export function AccessForm({ isUpdating, onSubmit }: AccessFormProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoomRole['role']>('User')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await onSubmit(email.trim().toLowerCase(), role)
      setEmail('')
      setRole('User')
    } catch {
      return
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Add a user
      </h3>
      <Input
        autoComplete="email"
        disabled={isUpdating}
        label="Email address"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="colleague@example.com"
        required
        type="email"
        value={email}
      />
      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="access-role"
        >
          Role
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          disabled={isUpdating}
          id="access-role"
          onChange={(event) => setRole(event.target.value as RoomRole['role'])}
          value={role}
        >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button isLoading={isUpdating} type="submit">
          Add
        </Button>
      </div>
    </form>
  )
}
