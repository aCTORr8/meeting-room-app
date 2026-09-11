import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function Register() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = async ({
    email,
    name,
    password,
  }) => {
    setAuthError('')

    try {
      await createAccount(email, password, name)
      navigate('/', { replace: true })
    } catch {
      setAuthError('Unable to create your account. Please try again.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Start booking meeting rooms in minutes
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            autoComplete="name"
            error={errors.name?.message}
            label="Full name"
            placeholder="Your name"
            type="text"
            {...register('name')}
          />
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Email address"
            placeholder="you@example.com"
            type="email"
            {...register('email')}
          />
          <Input
            autoComplete="new-password"
            error={errors.password?.message}
            label="Password"
            placeholder="At least 6 characters"
            type="password"
            {...register('password')}
          />
          <Input
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            label="Confirm password"
            placeholder="Repeat your password"
            type="password"
            {...register('confirmPassword')}
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
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
