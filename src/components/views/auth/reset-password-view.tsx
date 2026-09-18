'use client'
// Reset password (#/reset-password?token=…) — agent C.
// Token is issued by an admin (email delivery isn't configured on this deployment).

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { AuthShell } from './auth-shell'

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine(v => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type ResetValues = z.infer<typeof resetSchema>

export function ResetPasswordView({ token }: { token: string }) {
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ResetValues) =>
      api.post<{ ok: boolean }>('/auth/reset-password', { token, newPassword: values.newPassword }),
    onMutate: () => setPending(true),
    onSettled: () => setPending(false),
    onSuccess: () => {
      toast.success('Password updated — log in with your new password')
      navigate('/login')
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Reset failed — please try again')
    },
  })

  if (!token) {
    return (
      <AuthShell
        title="Reset link incomplete"
        description="This page needs a reset token from your admin-issued link."
        footer={<Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">Back to login</Link>}
      >
        <Alert variant="destructive">
          <AlertTitle>Missing reset token</AlertTitle>
          <AlertDescription>
            Open the full reset link your admin sent you — it looks like
            <span className="mt-1 block break-all font-mono text-xs">…/#/reset-password?token=…</span>
          </AlertDescription>
        </Alert>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password for your JEEForge account. This resets all your active sessions."
      footer={
        <>
          Remembered your old password?{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
            {pending ? 'Updating…' : 'Set new password'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
