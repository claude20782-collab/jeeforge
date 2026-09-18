'use client'
// Login (#/login) — agent C.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import type { PublicUser } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Loader2, LogIn } from 'lucide-react'
import { AuthShell } from './auth-shell'

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Enter your password'),
})
type LoginValues = z.infer<typeof loginSchema>

export function LoginView() {
  const setUser = useAppStore(s => s.setUser)
  const [pending, setPending] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: LoginValues) =>
      api.post<{ user: PublicUser; accessToken: string }>('/auth/login', values),
    onMutate: () => setPending(true),
    onSettled: () => setPending(false),
    onSuccess: (res) => {
      setUser(res.user, res.accessToken)
      toast.success(`Welcome back, ${res.user.displayName || res.user.username}`)
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Login failed — please try again')
    },
  })

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to resume an attempt, check your rank, or take today's mock."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or username</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com / aspirant_27" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
            {pending ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
