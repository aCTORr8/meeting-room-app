import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import { Input } from '../components/ui/Input'
import { AuthPageLayout } from '../features/auth/components/AuthPageLayout'
import {
  registerSchema,
  type RegisterFormValues,
} from '../features/auth/authSchemas'
import { useAuth } from '../features/auth/useAuth'

export function Register() {
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [authenticationError, setAuthenticationError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const handleRegistration: SubmitHandler<RegisterFormValues> = async ({
    email,
    name,
    password,
  }) => {
    setAuthenticationError('')

    try {
      await createAccount(email, password, name)
      navigate('/', { replace: true })
    } catch {
      setAuthenticationError('Unable to create your account. Please try again.')
    }
  }

  return (
    <AuthPageLayout
      footer={
        <>
          Already have an account?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            to="/login"
          >
            Sign in
          </Link>
        </>
      }
      subtitle="Start booking meeting rooms in minutes"
      title="Create an account"
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleRegistration)}>
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

        {authenticationError && <ErrorAlert message={authenticationError} />}

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Create account
        </Button>
      </form>
    </AuthPageLayout>
  )
}
