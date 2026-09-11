import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import { Input } from '../components/ui/Input'
import { AuthPageLayout } from '../features/auth/components/AuthPageLayout'
import {
  loginSchema,
  type LoginFormValues,
} from '../features/auth/authSchemas'
import { useAuth } from '../features/auth/useAuth'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [authenticationError, setAuthenticationError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin: SubmitHandler<LoginFormValues> = async ({
    email,
    password,
  }) => {
    setAuthenticationError('')

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setAuthenticationError('Unable to sign in. Check your email and password.')
    }
  }

  return (
    <AuthPageLayout
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            to="/register"
          >
            Create one
          </Link>
        </>
      }
      subtitle="Sign in to manage your meeting room bookings"
      title="Welcome back"
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
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

        {authenticationError && <ErrorAlert message={authenticationError} />}

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Sign in
        </Button>
      </form>
    </AuthPageLayout>
  )
}
