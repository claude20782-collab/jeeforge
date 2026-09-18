'use client'
// Shared Report dialog (agent F). Reports a user, a group, or a specific
// message via POST /api/reports. Rate limit: 10/h/user on the server.
import { useState } from 'react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Flag, Loader2 } from 'lucide-react'

const REASONS = [
  { value: 'SPAM', label: 'Spam or scams' },
  { value: 'ABUSE', label: 'Abusive content' },
  { value: 'HARASSMENT', label: 'Harassment or bullying' },
  { value: 'CHEATING', label: 'Cheating or malpractice' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { value: 'OTHER', label: 'Something else' },
] as const

export interface ReportTarget {
  targetType: 'USER' | 'GROUP' | 'GROUP_MESSAGE' | 'DIRECT_MESSAGE'
  what: string // shown in the dialog title, e.g. "@user" or "a message"
  /** USER reports: username (resolved server-side; works for private profiles). */
  targetUsername?: string
  targetGroupId?: string
  targetMessageId?: string
}

export function ReportDialog({ target, trigger, open, onOpenChange }: {
  target: ReportTarget
  trigger?: React.ReactNode
  /** controlled mode (message report menus pass their own open state) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [openInternal, setOpenInternal] = useState(false)
  const isOpen = open ?? openInternal
  const setOpen = (o: boolean) => {
    if (onOpenChange) onOpenChange(o)
    else setOpenInternal(o)
  }
  const [reason, setReason] = useState<string>('')
  const [details, setDetails] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async () => {
    if (!reason || pending) return
    setPending(true)
    try {
      await api.post('/reports', {
        targetType: target.targetType,
        reason,
        details: details.trim() || undefined,
        ...(target.targetUsername ? { targetUsername: target.targetUsername } : {}),
        ...(target.targetGroupId ? { targetGroupId: target.targetGroupId } : {}),
        ...(target.targetMessageId ? { targetMessageId: target.targetMessageId } : {}),
      })
      toast.success('Report submitted', { description: 'Our moderators will review it. Thank you for keeping JEEForge safe.' })
      setOpen(false)
      setReason('')
      setDetails('')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not submit the report')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { setOpen(o); if (!o) { setReason(''); setDetails('') } }}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {target.what}</DialogTitle>
          <DialogDescription>
            Reports are confidential and reviewed by moderators. Misuse may lead to action on your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`report-reason-${target.targetType}`}>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id={`report-reason-${target.targetType}`} aria-label="Report reason">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`report-details-${target.targetType}`}>Details <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              id={`report-details-${target.targetType}`}
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 2000))}
              placeholder="Add any context that helps moderators…"
              rows={3}
            />
            <p className="text-right text-xs text-muted-foreground">{details.length}/2000</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!reason || pending} variant="destructive">
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Submit report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
