import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async ({ email, password }) => {
    setAuthError('')

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setAuthError('Unable to sign in. Check your email and password.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your meeting room bookings
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Email address"
            placeholder="you@example.com"
            type="email"
            {...register('email')}
          />
          <Input
            autoComplete="current-password"
            error={errors.password?.message}
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register('password')}
          />

          {authError && (
            <div
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {authError}
            </div>
          )}

          <Button className="w-full" isLoading={isSubmitting} type="submit">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            to="/register"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}
