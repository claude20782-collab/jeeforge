'use client'
// Signup (#/signup) — agent C.

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
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Loader2, UserPlus } from 'lucide-react'
import { AuthShell } from './auth-shell'

const signupSchema = z.object({
  displayName: z.string().trim().max(40, 'Keep it under 40 characters').optional(),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, digits and _ only'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'At least 8 characters'),
})
type SignupValues = z.infer<typeof signupSchema>

export function SignupView() {
  const setUser = useAppStore(s => s.setUser)
  const [pending, setPending] = useState(false)
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { displayName: '', username: '', email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: SignupValues) =>
      api.post<{ user: PublicUser; accessToken: string }>('/auth/register', {
        displayName: values.displayName?.trim() ? values.displayName.trim() : undefined,
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    onMutate: () => setPending(true),
    onSettled: () => setPending(false),
    onSuccess: (res) => {
      setUser(res.user, res.accessToken)
      toast.success(`Account created — welcome, ${res.user.displayName || res.user.username}!`)
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Sign-up failed — please try again')
    },
  })

  return (
    <AuthShell
      title="Create your free account"
      description="One attempt per mock, live all-India ranks, solutions for every question — free forever."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Arjun Mehta" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="arjun_jee27" autoComplete="off" {...field} />
                </FormControl>
                <FormDescription>3–20 characters — lowercase letters, digits and underscore.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
                  <Input type="password" placeholder="At least 8 characters" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
            {pending ? 'Creating account…' : 'Create free account'}
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Free forever. Your email is only used for account security — never shared, never spammed.
          </p>
        </form>
      </Form>
    </AuthShell>
  )
}
