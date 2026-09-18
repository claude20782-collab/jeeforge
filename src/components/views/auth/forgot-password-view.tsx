'use client'
// Forgot password (#/forgot-password) — agent C.
// HONEST limitation: email delivery is NOT configured on this deployment.
// The API always responds ok (no user enumeration) and its message explains the limitation.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Link } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, Loader2, MailQuestion } from 'lucide-react'
import { AuthShell } from './auth-shell'

const forgotSchema = z.object({
  email: z.email('Enter a valid email address'),
})
type ForgotValues = z.infer<typeof forgotSchema>

export function ForgotPasswordView() {
  const [pending, setPending] = useState(false)
  const [doneMessage, setDoneMessage] = useState<string | null>(null)
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ForgotValues) =>
      api.post<{ ok: boolean; message: string }>('/auth/forgot-password', values),
    onMutate: () => setPending(true),
    onSettled: () => setPending(false),
    onSuccess: (res) => {
      setDoneMessage(res.message)
      toast.success('Request received')
    },
    onError: () => {
      toast.error('Something went wrong — please try again')
    },
  })

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter the email you signed up with and we'll process your request."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <Alert className="mb-5 border-primary/25 bg-primary/5">
        <Info className="h-4 w-4 text-primary" aria-hidden />
        <AlertTitle>Before you submit</AlertTitle>
        <AlertDescription className="leading-relaxed">
          Email delivery is <strong>not configured</strong> on this deployment, so no reset email
          can actually be sent. To reset your password, contact an admin — they can issue you a
          secure reset link that works on the reset-password page.
        </AlertDescription>
      </Alert>

      {doneMessage ? (
        <div className="space-y-4">
          <Alert>
            <MailQuestion className="h-4 w-4" aria-hidden />
            <AlertTitle>Request received</AlertTitle>
            <AlertDescription className="leading-relaxed">{doneMessage}</AlertDescription>
          </Alert>
          <Button variant="outline" className="w-full" onClick={() => setDoneMessage(null)}>
            Submit another email
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-4" noValidate>
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
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <MailQuestion className="h-4 w-4" aria-hidden />}
              {pending ? 'Submitting…' : 'Submit request'}
            </Button>
          </form>
        </Form>
      )}
    </AuthShell>
  )
}
