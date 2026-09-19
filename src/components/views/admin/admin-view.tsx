'use client'
// ============================================================================
// AdminView — #/admin/* (role ADMIN). Owner: agent G (T5-e).
// Subpaths: '' overview · /mocks · /users · /reports · /community · /analytics
// ============================================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { navigate } from '@/lib/router'
import type { MockSummary, MockValidation, AdminQuestionDTO, PublicUser } from '@/lib/types'
import { fmtDateTimeIST, fmtNumber, fmtPercent, timeAgo, ordinal } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  ShieldCheck, LayoutDashboard, ListChecks, Users, Flag, MessagesSquare, BarChart3,
  Megaphone, Search, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ChevronLeft,
  KeyRound, Ban, PauseCircle, PlayCircle, Trash2, FileText, Plus, ClipboardList,
} from 'lucide-react'

export function AdminView({ subpath }: { subpath: string }) {
  const user = useAppStore(s => s.user)
  const [tab, setTab] = useState(subpath.split('/')[0] || 'overview')
  const qc = useQueryClient()

  // keep tab in sync with direct hash navigation (#/admin/reports etc.)
  useEffect(() => {
    const t = setTimeout(() => setTab(subpath.split('/')[0] || 'overview'), 0)
    return () => clearTimeout(t)
  }, [subpath])

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="py-24 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-semibold">Admin access only</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'mocks', label: 'Mocks', icon: ListChecks },
    { id: 'questions', label: 'Questions', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'attempts', label: 'Attempts', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'community', label: 'Community', icon: MessagesSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Admin panel</h1>
          <p className="text-xs text-muted-foreground">Platform management · moderation · analytics</p>
        </div>
      </div>
      <Tabs value={tab} onValueChange={(v) => { setTab(v); window.location.hash = `#/admin${v === 'overview' ? '' : '/' + v}` }}>
        <div className="mb-5 overflow-x-auto">
          <TabsList className="h-auto w-max gap-0.5 bg-muted/50 p-1">
            {tabs.map(t => (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5 px-3 py-1.5 text-[13px]">
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="overview"><OverviewTab qc={qc} /></TabsContent>
        <TabsContent value="mocks"><MocksTab qc={qc} /></TabsContent>
        <TabsContent value="questions"><QuestionsTab qc={qc} /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="attempts"><AttemptsTab qc={qc} /></TabsContent>
        <TabsContent value="reports"><ReportsTab qc={qc} /></TabsContent>
        <TabsContent value="community"><CommunityTab qc={qc} /></TabsContent>
        <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
      </Tabs>
    </div>
  )
}

// ================= OVERVIEW =================
interface OverviewData {
  counts: { users: number; activeToday: number; attempts: number; submittedAttempts: number; publishedMocks: number; draftMocks: number; openReports: number; groups: number }
  avgScore: number | null
  participation: Array<{ mockNumber: number; title: string; attempts: number; avgScore: number | null }>
  recentUsers: Array<{ username: string; createdAt: string }>
  recentAttempts: Array<{ username: string; mockNumber: number; score: number | null; submittedAt: string }>
  recentReports: Array<{ id: string; reason: string; status: string; createdAt: string }>
}
function OverviewTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data, isLoading } = useQuery({ queryKey: ['admin-overview'], queryFn: () => api.get<{ [k: string]: unknown } | OverviewData>('/admin/overview') })
  const [announceOpen, setAnnounceOpen] = useState(false)
  if (isLoading || !data) return <SkeletonGrid />
  const d = data as unknown as OverviewData
  const cards = [
    { label: 'Users', value: d.counts.users, sub: `${d.counts.activeToday} active today` },
    { label: 'Attempts', value: d.counts.attempts, sub: `${d.counts.submittedAttempts} submitted` },
    { label: 'Published mocks', value: d.counts.publishedMocks, sub: `${d.counts.draftMocks} in preparation` },
    { label: 'Open reports', value: d.counts.openReports, sub: d.counts.openReports > 0 ? 'needs review' : 'all clear' },
    { label: 'Groups', value: d.counts.groups, sub: 'community' },
    { label: 'Avg score', value: d.avgScore != null ? fmtNumber(d.avgScore, 1) : '—', sub: 'of 300, submitted' },
  ]
  return (
    <div className="space-y-5">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ['admin-overview'] })}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh</Button>
        <Button size="sm" onClick={() => setAnnounceOpen(true)}><Megaphone className="mr-1.5 h-3.5 w-3.5" /> Announce</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(c => (
          <Card key={c.label} className="border-border/70"><CardContent className="p-4">
            <div className="text-2xl font-bold tracking-tight">{c.value}</div>
            <div className="text-xs font-medium text-muted-foreground">{c.label}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground/70">{c.sub}</div>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Participation by mock</CardTitle></CardHeader>
        <CardContent>
          {d.participation.length === 0 ? <Empty text="No attempts yet." /> : (
            <ScrollArea className="max-h-64"><Table>
              <TableHeader><TableRow><TableHead>Mock</TableHead><TableHead>Attempts</TableHead><TableHead className="text-right">Avg score</TableHead></TableRow></TableHeader>
              <TableBody>{d.participation.map(p => (
                <TableRow key={p.mockNumber}>
                  <TableCell className="font-medium">#{String(p.mockNumber).padStart(2, '0')} {p.title.split('—').pop()}</TableCell>
                  <TableCell>{p.attempts}</TableCell>
                  <TableCell className="text-right">{p.avgScore != null ? fmtNumber(p.avgScore, 1) : '—'}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table></ScrollArea>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-3 md:grid-cols-3">
        <MiniList title="Recent users" items={d.recentUsers.map(u => ({ main: '@' + u.username, sub: timeAgo(u.createdAt) }))} />
        <MiniList title="Recent attempts" items={d.recentAttempts.map(a => ({ main: `@${a.username} · Mock ${String(a.mockNumber).padStart(2, '0')}`, sub: `${a.score ?? '—'} / 300 · ${timeAgo(a.submittedAt)}` }))} />
        <MiniList title="Recent reports" items={d.recentReports.map(r => ({ main: r.reason, sub: `${r.status} · ${timeAgo(r.createdAt)}` }))} />
      </div>
      <AnnounceDialog open={announceOpen} onOpenChange={setAnnounceOpen} />
    </div>
  )
}
function AnnounceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Broadcast announcement</DialogTitle>
          <DialogDescription>Sends a MOCK_ANNOUNCEMENT notification to every active user.</DialogDescription></DialogHeader>
        <div className="space-y-3 py-1">
          <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mock 02 unlocks tomorrow at 12 AM IST" /></div>
          <div><Label>Message</Label><Textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Details users should know…" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={busy || !title.trim() || !body.trim()} onClick={async () => {
            setBusy(true)
            try {
              const r = await api.post<{ recipients: number }>('/admin/announce', { title: title.trim(), body: body.trim() })
              toast.success(`Announcement sent to ${r.recipients} users`)
              onOpenChange(false); setTitle(''); setBody('')
            } catch (e) { toast.error((e as ApiError).message) } finally { setBusy(false) }
          }}>{busy ? 'Sending…' : 'Send'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ================= MOCKS =================
type AdminMock = MockSummary & { validation: MockValidation | null; counts: { total: number; physics: number; chemistry: number; maths: number; withDiagram: number } }
function MocksTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data, isLoading } = useQuery({ queryKey: ['admin-mocks'], queryFn: () => api.get<{ mocks: AdminMock[] }>('/admin/mocks') })
  const [selected, setSelected] = useState<AdminMock | null>(null)
  if (isLoading || !data) return <SkeletonGrid />
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[65vh]"><Table>
            <TableHeader><TableRow>
              <TableHead>Mock</TableHead><TableHead>Unlocks (IST)</TableHead><TableHead>Questions</TableHead>
              <TableHead>Diagrams</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>{data.mocks.map(m => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">#{String(m.mockNumber).padStart(2, '0')}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmtDateTimeIST(m.scheduledAt)}</TableCell>
                <TableCell>
                  <span className={m.counts.total === 75 ? 'font-semibold text-[var(--correct)]' : ''}>{m.counts.total}/75</span>
                  <span className="ml-1 text-[11px] text-muted-foreground">({m.counts.physics}P {m.counts.chemistry}C {m.counts.maths}M)</span>
                </TableCell>
                <TableCell><span className={m.counts.withDiagram >= 20 ? 'font-semibold text-[var(--correct)]' : 'text-[var(--wrong)]'}>{m.counts.withDiagram}</span></TableCell>
                <TableCell>
                  <Badge variant={m.status === 'PUBLISHED' ? 'default' : 'secondary'} className={m.status === 'PUBLISHED' ? 'bg-[var(--correct)]/15 text-[var(--correct)]' : ''}>
                    {m.status === 'PUBLISHED' ? 'Published' : m.status === 'RETRACTED' ? 'Retracted' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setSelected(m)}>Validate</Button>
                    {m.status !== 'PUBLISHED' ? (
                      <Button size="sm" onClick={async () => {
                        try {
                          const r = await api.post<{ validation: MockValidation }>(`/admin/mocks/${m.id}/publish`)
                          toast.success(`Mock ${m.mockNumber} published ✓`)
                          qc.invalidateQueries({ queryKey: ['admin-mocks'] })
                        } catch (e) {
                          const ae = e as ApiError
                          toast.error(ae.message.includes('validation') ? `Validation failed — ${r_validationErrors(ae)}` : ae.message, { duration: 8000 })
                          qc.invalidateQueries({ queryKey: ['admin-mocks'] })
                        }
                      }}>Publish</Button>
                    ) : (
                      <Button size="sm" variant="destructive" className="h-7" onClick={async () => {
                        try { await api.post(`/admin/mocks/${m.id}/unpublish`); toast.success('Unpublished — existing results stay intact'); qc.invalidateQueries({ queryKey: ['admin-mocks'] }) }
                        catch (e) { toast.error((e as ApiError).message) }
                      }}>Unpublish</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></ScrollArea>
        </CardContent>
      </Card>
      <ValidationDialog mock={selected} onClose={() => { setSelected(null); qc.invalidateQueries({ queryKey: ['admin-mocks'] }) }} />
    </div>
  )
}
function r_validationErrors(e: ApiError): string {
  try {
    const v = (e as unknown as { validation?: MockValidation }).validation
    if (v?.errors?.length) return v.errors.slice(0, 3).map(x => x.message).join(' · ')
  } catch { /* ignore */ }
  return 'see validation details'
}
function ValidationDialog({ mock, onClose }: { mock: AdminMock | null; onClose: () => void }) {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['validate', mock?.id],
    queryFn: () => api.post<{ validation: MockValidation }>(`/admin/mocks/${mock?.id}/validate`),
    enabled: !!mock, retry: false,
  })
  const v = data?.validation ?? mock?.validation ?? null
  return (
    <Dialog open={!!mock} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Validation — Mock {mock?.mockNumber}</DialogTitle>
          <DialogDescription>Publication gate (spec §24): a mock publishes only when every check passes.</DialogDescription></DialogHeader>
        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Re-run</Button>
          {v && <Badge className={v.passed ? 'bg-[var(--correct)]/15 text-[var(--correct)]' : 'bg-[var(--wrong)]/15 text-[var(--wrong)]'}>{v.passed ? 'PASSED' : `${v.errors.length} error(s)`}</Badge>}
        </div>
        {v && (
          <ScrollArea className="max-h-80 pr-2">
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
              <Check ok={v.checks.totalQuestions === 75}>75 questions ({v.checks.totalQuestions})</Check>
              <Check ok={v.checks.physics === 25}>Physics 25 ({v.checks.physics})</Check>
              <Check ok={v.checks.chemistry === 25}>Chemistry 25 ({v.checks.chemistry})</Check>
              <Check ok={v.checks.maths === 25}>Maths 25 ({v.checks.maths})</Check>
              <Check ok={v.checks.withSolution === v.checks.totalQuestions}>Solutions ({v.checks.withSolution})</Check>
              <Check ok={v.checks.withAnswer === v.checks.totalQuestions}>Answers ({v.checks.withAnswer})</Check>
              <Check ok={v.checks.withChapter === v.checks.totalQuestions}>Chapters</Check>
              <Check ok={v.checks.withTopic === v.checks.totalQuestions}>Topics</Check>
              <Check ok={v.checks.withDifficulty === v.checks.totalQuestions}>Difficulty</Check>
              <Check ok={v.checks.withDiagram >= 20}>≥20 diagrams ({v.checks.withDiagram})</Check>
              <Check ok={v.checks.duplicates === 0}>No duplicates</Check>
              <Check ok={v.checks.marksValid}>300 marks · 180 min</Check>
            </div>
            {v.errors.length > 0 && (
              <div className="mt-3 space-y-1">
                {v.errors.slice(0, 12).map((e, i) => (
                  <div key={i} className="flex items-start gap-1.5 rounded border border-[var(--wrong)]/30 bg-[var(--wrong)]/10 px-2 py-1 text-[11px]">
                    <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-[var(--wrong)]" />{e.message}
                  </div>
                ))}
              </div>
            )}
            {v.warnings.length > 0 && (
              <div className="mt-2 space-y-1">
                {v.warnings.slice(0, 6).map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5 rounded border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />{w.message}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-1.5 rounded px-1.5 py-1 ${ok ? 'text-[var(--correct)]' : 'text-[var(--wrong)]'}`}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
      <span className="text-foreground/90">{children}</span>
    </div>
  )
}

// ================= QUESTIONS =================
function QuestionsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data: chapters } = useQuery({ queryKey: ['admin-chapters'], queryFn: () => api.get<{ chapters: Array<{ id: string; subject: string; name: string; topics: Array<{ id: string; name: string }> }> }>('/admin/chapters') })
  const [mockId, setMockId] = useState<string | null>(null)
  const { data: mocks } = useQuery({ queryKey: ['admin-mocks'], queryFn: () => api.get<{ mocks: AdminMock[] }>('/admin/mocks') })
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<AdminQuestionDTO | null>(null)
  const { data: questions, isLoading } = useQuery({
    queryKey: ['admin-mock-questions', mockId],
    queryFn: () => api.get<{ questions: AdminQuestionDTO[] }>(`/admin/mocks/${mockId}/questions`),
    enabled: !!mockId,
  })
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-64">
          <Select value={mockId ?? ''} onValueChange={setMockId}>
            <SelectTrigger><SelectValue placeholder="Choose a mock…" /></SelectTrigger>
            <SelectContent>{(mocks?.mocks ?? []).map(m => (
              <SelectItem key={m.id} value={m.id}>Mock {String(m.mockNumber).padStart(2, '0')} — {m.counts.total}/75 Qs</SelectItem>
            ))}</SelectContent>
          </Select>
        </div>
        <Button size="sm" disabled={!mockId} onClick={() => { setEditing(null); setEditorOpen(true) }}><Plus className="mr-1.5 h-3.5 w-3.5" /> New question</Button>
      </div>
      {!mockId ? <Empty text="Select a mock to browse and edit its questions." /> : isLoading || !questions ? <SkeletonGrid /> : (
        <Card><CardContent className="p-0">
          <ScrollArea className="max-h-[65vh]"><Table>
            <TableHeader><TableRow><TableHead className="w-10">#</TableHead><TableHead>Question</TableHead><TableHead>Subject</TableHead><TableHead>Difficulty</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{questions.questions.map((q, i) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs">{i + 1}</TableCell>
                <TableCell className="max-w-md truncate text-xs">{q.text.slice(0, 90)}…</TableCell>
                <TableCell className="text-xs">{q.subject[0]}{q.subject.slice(1, 4).toLowerCase()}</TableCell>
                <TableCell><DifficultyBadge d={q.difficulty} /></TableCell>
                <TableCell className="text-xs">{q.sourceType === 'PYQ' ? `PYQ ${q.pyqYear ?? ''}` : 'Original'}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(q); setEditorOpen(true) }}>Edit</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => {
                    if (!confirm('Delete this question? It will be removed from all draft mocks.')) return
                    try { await api.del(`/admin/questions/${q.id}`); toast.success('Question deleted'); qc.invalidateQueries({ queryKey: ['admin-mock-questions', mockId] }); qc.invalidateQueries({ queryKey: ['admin-mocks'] }) }
                    catch (e) { toast.error((e as ApiError).message) }
                  }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></ScrollArea>
        </CardContent></Card>
      )}
      <QuestionEditorDialog open={editorOpen} onOpenChange={setEditorOpen} mockId={mockId} question={editing} chapters={chapters?.chapters ?? []} qc={qc} />
    </div>
  )
}
function DifficultyBadge({ d }: { d: string }) {
  const map: Record<string, string> = {
    EASY: 'bg-[var(--correct)]/15 text-[var(--correct)]',
    MODERATE: 'bg-primary/15 text-primary',
    HARD: 'bg-orange-500/15 text-orange-400',
    VERY_HARD: 'bg-[var(--wrong)]/15 text-[var(--wrong)]',
  }
  return <Badge variant="secondary" className={`text-[10px] ${map[d] ?? ''}`}>{d.replace('_', ' ')}</Badge>
}
function QuestionEditorDialog({ open, onOpenChange, mockId, question, chapters, qc }: {
  open: boolean; onOpenChange: (b: boolean) => void; mockId: string | null
  question: AdminQuestionDTO | null
  chapters: Array<{ id: string; subject: string; name: string; topics: Array<{ id: string; name: string }> }>
  qc: ReturnType<typeof useQueryClient>
}) {
  const [form, setForm] = useState(() => blankForm())
  const [busy, setBusy] = useState(false)
  const [initialized, setInitialized] = useState<string | null>(null)
  const key = question?.id ?? 'new'
  if (open && initialized !== key) {
    setInitialized(key)
    setForm(question ? {
      subject: question.subject, section: question.section, text: question.text,
      options: question.options ?? ['', '', '', ''], correctAnswer: question.correctAnswer,
      solutionText: question.solutionText, formulaConcept: question.formulaConcept,
      difficulty: question.difficulty, chapterId: question.chapterId, topicId: question.topicId,
      sourceType: question.sourceType, pyqYear: question.pyqYear ? String(question.pyqYear) : '', pyqShift: question.pyqShift ?? '',
      diagramJson: question.diagram ? JSON.stringify(question.diagram, null, 1) : '',
    } : blankForm())
  }
  const subjectChapters = chapters.filter(c => c.subject === form.subject)
  const chapter = subjectChapters.find(c => c.id === form.chapterId)
  const set = <K extends keyof ReturnType<typeof blankForm>>(k: K, v: ReturnType<typeof blankForm>[K]) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.text.trim().length > 10 && form.solutionText.trim().length >= 30 && form.chapterId && form.topicId &&
    (form.section === 'B' ? /^-?\d+(\.\d+)?$/.test(form.correctAnswer.trim()) : ['A', 'B', 'C', 'D'].includes(form.correctAnswer) && form.options.every(o => o.trim() !== ''))
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit question' : 'New question'}</DialogTitle>
          <DialogDescription>All fields required; solution ≥ 30 chars. Section A = MCQ, B = numerical.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1">
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Subject</Label>
              <Select value={form.subject} onValueChange={v => set('subject', v as typeof form.subject)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHYSICS">Physics</SelectItem><SelectItem value="CHEMISTRY">Chemistry</SelectItem><SelectItem value="MATHEMATICS">Maths</SelectItem>
                </SelectContent>
              </Select></div>
            <div><Label>Section</Label>
              <Select value={form.section} onValueChange={v => set('section', v as 'A' | 'B')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="A">A — MCQ</SelectItem><SelectItem value="B">B — numerical</SelectItem></SelectContent>
              </Select></div>
            <div><Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={v => set('difficulty', v as typeof form.difficulty)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['EASY', 'MODERATE', 'HARD', 'VERY_HARD'].map(d => <SelectItem key={d} value={d}>{d.replace('_', ' ')}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Chapter</Label>
              <Select value={form.chapterId} onValueChange={v => { set('chapterId', v); set('topicId', '') }}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{subjectChapters.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select></div>
            <div><Label>Topic</Label>
              <Select value={form.topicId} onValueChange={v => set('topicId', v)} disabled={!chapter}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{(chapter?.topics ?? []).map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          <div><Label>Question text (markdown + $LaTeX$)</Label>
            <Textarea value={form.text} onChange={e => set('text', e.target.value)} rows={4} /></div>
          {form.section === 'A' ? (
            <div className="grid grid-cols-2 gap-2">
              {form.options.map((o, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Badge variant="outline" className="h-6 w-6 justify-center p-0 font-mono">{'ABCD'[i]}</Badge>
                  <Input value={o} onChange={e => set('options', form.options.map((x, j) => j === i ? e.target.value : x))} placeholder={`Option ${'ABCD'[i]}`} />
                </div>
              ))}
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <div><Label>{form.section === 'A' ? 'Correct option' : 'Correct answer (numeric)'}</Label>
              {form.section === 'A' ? (
                <Select value={form.correctAnswer} onValueChange={v => set('correctAnswer', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['A', 'B', 'C', 'D'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              ) : <Input value={form.correctAnswer} onChange={e => set('correctAnswer', e.target.value)} placeholder="e.g. 42 or -1.25" />}</div>
            <div><Label>Source type</Label>
              <Select value={form.sourceType} onValueChange={v => set('sourceType', v as 'PYQ' | 'ORIGINAL')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ORIGINAL">Original</SelectItem><SelectItem value="PYQ">PYQ</SelectItem></SelectContent>
              </Select></div>
          </div>
          {form.sourceType === 'PYQ' && (
            <div className="grid grid-cols-2 gap-2">
              <div><Label>PYQ year (only if verifiably true)</Label><Input value={form.pyqYear} onChange={e => set('pyqYear', e.target.value)} placeholder="2023" inputMode="numeric" /></div>
              <div><Label>Shift</Label><Input value={form.pyqShift} onChange={e => set('pyqShift', e.target.value)} placeholder="24 Jan Shift 1" /></div>
            </div>
          )}
          <div><Label>Formula / concept</Label><Input value={form.formulaConcept} onChange={e => set('formulaConcept', e.target.value)} /></div>
          <div><Label>Complete solution (markdown + $LaTeX$)</Label>
            <Textarea value={form.solutionText} onChange={e => set('solutionText', e.target.value)} rows={6} /></div>
          <div><Label>Diagram spec (JSON, optional)</Label>
            <Textarea value={form.diagramJson} onChange={e => set('diagramJson', e.target.value)} rows={3} className="font-mono text-xs" placeholder='{"kind":"graph","xAxis":{"min":0,"max":10},…}' /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={busy || !valid} onClick={async () => {
            setBusy(true)
            try {
              let diagram: unknown = null
              if (form.diagramJson.trim()) {
                try { diagram = JSON.parse(form.diagramJson) } catch { throw new Error('Diagram JSON is invalid') }
              }
              const payload: Record<string, unknown> = {
                subject: form.subject, section: form.section, text: form.text,
                options: form.section === 'A' ? form.options : null,
                correctAnswer: form.correctAnswer, solutionText: form.solutionText,
                formulaConcept: form.formulaConcept, difficulty: form.difficulty,
                chapterId: form.chapterId, topicId: form.topicId,
                sourceType: form.sourceType,
                pyqYear: form.pyqYear ? parseInt(form.pyqYear, 10) : null,
                pyqShift: form.pyqShift || null, diagram,
              }
              if (question) {
                await api.put(`/admin/questions/${question.id}`, payload)
                toast.success('Question updated')
              } else {
                const { question: created } = await api.post<{ question: { id: string } }>('/admin/questions', payload)
                if (mockId) {
                  const { questions } = await api.get<{ questions: AdminQuestionDTO[] }>(`/admin/mocks/${mockId}/questions`)
                  const slot = questions.length + 1
                  try { await api.post(`/admin/mocks/${mockId}/questions`, { questionId: created.id, order: slot }); toast.success(`Question added at slot ${slot}`) }
                  catch (e) { toast.warning(`Created question, but attach failed: ${(e as ApiError).message}`) }
                } else { toast.success('Question created') }
              }
              onOpenChange(false); setInitialized(null)
              qc.invalidateQueries({ queryKey: ['admin-mock-questions', mockId] }); qc.invalidateQueries({ queryKey: ['admin-mocks'] })
            } catch (e) { toast.error((e as ApiError).message) } finally { setBusy(false) }
          }}>{busy ? 'Saving…' : question ? 'Save changes' : 'Create question'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function blankForm() {
  return {
    subject: 'PHYSICS' as const, section: 'A' as const, text: '', options: ['', '', '', ''],
    correctAnswer: 'A', solutionText: '', formulaConcept: '', difficulty: 'HARD' as const,
    chapterId: '', topicId: '', sourceType: 'ORIGINAL' as const, pyqYear: '', pyqShift: '', diagramJson: '',
  }
}

// ================= USERS =================
type AdminUser = { id: string; username: string; email: string; role: string; status: string; createdAt: string; lastActiveAt: string | null; attemptCount: number; mockCount: number }
function UsersTab() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', q, page],
    queryFn: () => api.get<{ users: AdminUser[]; total: number }>(`/admin/users?q=${encodeURIComponent(q)}&page=${page}`),
  })
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => { setQ(e.target.value); setPage(0) }} placeholder="Search username or email…" className="pl-8" />
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()}><RefreshCw className="h-3.5 w-3.5" /></Button>
      </div>
      {isLoading || !data ? <SkeletonGrid /> : (
        <Card><CardContent className="p-0">
          <ScrollArea className="max-h-[65vh]"><Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Attempts</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{data.users.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">@{u.username}{u.role === 'ADMIN' && <Badge className="ml-1.5 bg-primary/15 text-primary" variant="secondary">admin</Badge>}</div>
                  <div className="text-[11px] text-muted-foreground">last active {u.lastActiveAt ? timeAgo(u.lastActiveAt) : 'never'}</div>
                </TableCell>
                <TableCell className="text-xs">{u.email}</TableCell>
                <TableCell className="text-xs">{u.attemptCount} <span className="text-muted-foreground">({u.mockCount} mocks)</span></TableCell>
                <TableCell>
                  <Badge variant="secondary" className={u.status === 'ACTIVE' ? 'bg-[var(--correct)]/15 text-[var(--correct)]' : u.status === 'SUSPENDED' ? 'bg-orange-500/15 text-orange-400' : 'bg-[var(--wrong)]/15 text-[var(--wrong)]'}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmtDateTimeIST(u.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
                      <>
                        <Button size="sm" variant="ghost" title="Suspend" onClick={() => setStatus(u, 'SUSPENDED')}><PauseCircle className="h-4 w-4 text-orange-400" /></Button>
                        <Button size="sm" variant="ghost" title="Ban" onClick={() => setStatus(u, 'BANNED')}><Ban className="h-4 w-4 text-[var(--wrong)]" /></Button>
                      </>
                    )}
                    {u.status !== 'ACTIVE' && u.role !== 'ADMIN' && (
                      <Button size="sm" variant="ghost" title="Restore" onClick={() => setStatus(u, 'ACTIVE')}><PlayCircle className="h-4 w-4 text-[var(--correct)]" /></Button>
                    )}
                    {u.role !== 'ADMIN' && (
                      <Button size="sm" variant="ghost" title="Issue password reset" onClick={async () => {
                        try {
                          const r = await api.post<{ token: string }>(`/admin/users/${u.id}/reset-password`)
                          const link = `${window.location.origin}/#/reset-password?token=${r.token}`
                          await navigator.clipboard?.writeText(link).catch(() => {})
                          toast.success('Reset link (copied to clipboard)', { description: link, duration: 12000 })
                        } catch (e) { toast.error((e as ApiError).message) }
                      }}><KeyRound className="h-4 w-4" /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></ScrollArea>
        </CardContent></Card>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{data ? `${data.total} users` : ''}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={!data || (page + 1) * 20 >= data.total} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
  async function setStatus(u: AdminUser, status: string) {
    if (!confirm(`${status} @${u.username}?`)) return
    try { await api.post(`/admin/users/${u.id}/status`, { status, note: `admin action from panel` }); toast.success(`@${u.username} → ${status}`); refetch() }
    catch (e) { toast.error((e as ApiError).message) }
  }
}

// ================= ATTEMPTS =================
type AdminAttempt = {
  id: string; username: string; email: string; mockNumber: number; status: string
  score: number | null; subjectScores: Array<number | null> | null
  startedAt: string; submittedAt: string | null; autoSubmitted: boolean; answered: number
}
function AttemptsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [page, setPage] = useState(0)
  const [mockFilter, setMockFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-attempts', page, mockFilter, statusFilter],
    queryFn: () => api.get<{ total: number; attempts: AdminAttempt[] }>(`/admin/attempts?page=${page}&mockNumber=${mockFilter}&status=${statusFilter}`),
  })
  const mocksQ = useQuery({ queryKey: ['admin-mocks'], queryFn: () => api.get<{ mocks: Array<{ mockNumber: number; status: string }> }>('/admin/mocks') })
  const published = (mocksQ.data?.mocks ?? []).filter(m => m.status === 'PUBLISHED')

  async function deleteAttempt(a: AdminAttempt) {
    if (!confirm(`Delete @${a.username}'s attempt on Mock ${String(a.mockNumber).padStart(2, '0')} (${a.status === 'SUBMITTED' ? `score ${a.score ?? '—'}/300, ` : 'in progress, '}no undo)?\nThey will be able to retake the mock.`)) return
    try {
      await api.del('/admin/attempts', { attemptId: a.id })
      toast.success(`Deleted @${a.username}'s attempt — mock ${String(a.mockNumber).padStart(2, '0')} retake unlocked`)
      refetch()
      qc.invalidateQueries({ queryKey: ['admin-overview'] })
    } catch (e) { toast.error((e as ApiError).message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={mockFilter} onValueChange={(v) => { setMockFilter(v); setPage(0) }}>
            <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Mock" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All mocks</SelectItem>
              {published.map(m => <SelectItem key={m.mockNumber} value={String(m.mockNumber)}>Mock {String(m.mockNumber).padStart(2, '0')}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={() => refetch()}><RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /></Button>
        </div>
        <span className="text-xs text-muted-foreground">{data ? `${data.total} attempts` : ''}</span>
      </div>
      {isLoading ? <div className="p-10 text-center text-sm text-muted-foreground">Loading attempts…</div> : (
        <Card><CardContent className="p-0">
          <ScrollArea className="max-h-[62vh]">
            <Table>
              <TableHeader><TableRow>
                <TableHead>User</TableHead><TableHead>Mock</TableHead><TableHead>Status</TableHead>
                <TableHead>Score</TableHead><TableHead>Answered</TableHead><TableHead>Started</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {(data?.attempts ?? []).map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="text-sm font-medium">@{a.username}</div>
                      <div className="text-[11px] text-muted-foreground">{a.email}</div>
                    </TableCell>
                    <TableCell className="text-xs">{String(a.mockNumber).padStart(2, '0')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={a.status === 'SUBMITTED' ? 'bg-[var(--correct)]/15 text-[var(--correct)]' : 'bg-[var(--chart-5)]/15 text-[var(--chart-5)]'}>
                        {a.status === 'SUBMITTED' ? (a.autoSubmitted ? 'auto-submitted' : 'submitted') : 'in progress'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {a.score != null ? (
                        <div>
                          <span className="font-semibold">{a.score}/300</span>
                          {a.subjectScores && <div className="text-[11px] text-muted-foreground">P {a.subjectScores[0] ?? '—'} · C {a.subjectScores[1] ?? '—'} · M {a.subjectScores[2] ?? '—'}</div>}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-xs">{a.answered}/75</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmtDateTimeIST(a.startedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" title="Delete attempt (unlocks retake)" onClick={() => deleteAttempt(a)}>
                        <Trash2 className="h-4 w-4 text-[var(--wrong)]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(data?.attempts ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No attempts match the filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent></Card>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Deleting an attempt permanently removes its answers and lets the user retake the mock.</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={!data || (page + 1) * 20 >= data.total} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}

// ================= REPORTS =================
type AdminReport = { id: string; targetType: string; reason: string; details: string | null; status: string; createdAt: string; reporterUsername: string; targetUsername: string | null; snippet: string | null }
function ReportsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [status, setStatus] = useState('OPEN')
  const { data, isLoading } = useQuery({ queryKey: ['admin-reports', status], queryFn: () => api.get<{ reports: AdminReport[] }>(`/admin/reports?status=${status}`) })
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['OPEN', 'RESOLVED', 'DISMISSED'].map(s => (
          <Button key={s} size="sm" variant={status === s ? 'default' : 'outline'} onClick={() => setStatus(s)}>{s}</Button>
        ))}
      </div>
      {isLoading || !data ? <SkeletonGrid /> : data.reports.length === 0 ? <Empty text={`No ${status.toLowerCase()} reports.`} /> : (
        <div className="space-y-3">
          {data.reports.map(r => (
            <Card key={r.id}><CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{r.targetType.replace('_', ' ')}</Badge>
                    <Badge variant="secondary" className="bg-[var(--wrong)]/10 text-[var(--wrong)]">{r.reason}</Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">@{r.reporterUsername} reported </span>
                    {r.targetUsername ? <b>@{r.targetUsername}</b> : <b className="font-mono text-xs">msg:{r.id.slice(-8)}</b>}
                  </p>
                  {r.details && <p className="mt-1 text-xs text-muted-foreground">“{r.details}”</p>}
                  {r.snippet && <p className="mt-1 rounded bg-muted/50 px-2 py-1 text-xs italic">“{r.snippet}”</p>}
                </div>
                {r.status === 'OPEN' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={async () => {
                      try { await api.post(`/admin/reports/${r.id}/resolve`, { resolution: 'DISMISSED', note: 'no action needed' }); toast.success('Dismissed'); qc.invalidateQueries({ queryKey: ['admin-reports'] }) }
                      catch (e) { toast.error((e as ApiError).message) }
                    }}>Dismiss</Button>
                    <Button size="sm" onClick={async () => {
                      try { await api.post(`/admin/reports/${r.id}/resolve`, { resolution: 'RESOLVED', note: 'action taken' }); toast.success('Resolved'); qc.invalidateQueries({ queryKey: ['admin-reports'] }) }
                      catch (e) { toast.error((e as ApiError).message) }
                    }}>Resolve</Button>
                  </div>
                )}
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ================= COMMUNITY =================
type AdminGroup = { id: string; name: string; isPrivate: boolean; memberCount: number; owner: { username: string }; messageCount: number }
function CommunityTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data, isLoading } = useQuery({ queryKey: ['admin-groups'], queryFn: () => api.get<{ groups: AdminGroup[] }>('/admin/groups') })
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Groups overview. For message-level moderation, use the group page as an admin — messages carry a delete action there; all deletions are logged.</p>
      {isLoading || !data ? <SkeletonGrid /> : data.groups.length === 0 ? <Empty text="No groups yet." /> : (
        <Card><CardContent className="p-0">
          <ScrollArea className="max-h-[65vh]"><Table>
            <TableHeader><TableRow><TableHead>Group</TableHead><TableHead>Owner</TableHead><TableHead>Members</TableHead><TableHead>Messages</TableHead><TableHead>Privacy</TableHead></TableRow></TableHeader>
            <TableBody>{data.groups.map(g => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell className="text-xs">@{g.owner.username}</TableCell>
                <TableCell>{g.memberCount}</TableCell>
                <TableCell>{g.messageCount}</TableCell>
                <TableCell><Badge variant="secondary">{g.isPrivate ? 'Private' : 'Public'}</Badge></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table></ScrollArea>
        </CardContent></Card>
      )}
    </div>
  )
}

// ================= ANALYTICS =================
type Analytics = {
  questionStats: Array<{ id: string; text: string; subject: string; difficulty: string; attempts: number; correctRate: number | null; avgTimeSeconds: number | null; mockNumbers: number[] }>
  subjectAverages: Array<{ subject: string; correct: number; wrong: number; avgTime: number | null }>
  difficultyAverages: Array<{ difficulty: string; attempted: number; correct: number; avgTime: number | null }>
  scoreDistribution: Array<{ bucket: string; count: number }>
}
function AnalyticsTab() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-analytics'], queryFn: () => api.get<Analytics>('/admin/analytics') })
  if (isLoading || !data) return <SkeletonGrid />
  const maxScore = Math.max(1, ...data.scoreDistribution.map(b => b.count))
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Score distribution (submitted attempts)</CardTitle></CardHeader>
          <CardContent>
            {data.scoreDistribution.every(b => b.count === 0) ? <Empty text="No submitted attempts yet." /> : (
              <div className="flex h-40 items-end gap-1">
                {data.scoreDistribution.map(b => (
                  <div key={b.bucket} className="group relative flex-1" title={`${b.bucket}: ${b.count}`}>
                    <div className="w-full rounded-t bg-primary/70 transition group-hover:bg-primary" style={{ height: `${(b.count / maxScore) * 100}%`, minHeight: b.count > 0 ? 3 : 0 }} />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>0</span><span>150</span><span>300</span></div>
          </CardContent>
        </Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Subject performance (attempts ≥ 10)</CardTitle></CardHeader>
          <CardContent>
            {data.subjectAverages.length === 0 ? <Empty text="Not enough data yet." /> : (
              <Table><TableBody>{data.subjectAverages.map(s => (
                <TableRow key={s.subject}>
                  <TableCell className="font-medium">{s.subject.charAt(0) + s.subject.slice(1).toLowerCase()}</TableCell>
                  <TableCell className="text-xs text-[var(--correct)]">{s.correct} correct</TableCell>
                  <TableCell className="text-xs text-[var(--wrong)]">{s.wrong} wrong</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{s.avgTime ? `${Math.round(s.avgTime)}s avg` : '—'}</TableCell>
                </TableRow>
              ))}</TableBody></Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Question statistics (attempts ≥ 10)</CardTitle></CardHeader>
        <CardContent className="p-0">
          {data.questionStats.length === 0 ? <div className="p-4"><Empty text="Questions need ≥10 attempts before statistics appear." /></div> : (
            <ScrollArea className="max-h-96"><Table>
              <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Subject</TableHead><TableHead>Attempts</TableHead><TableHead>Correct rate</TableHead><TableHead>Avg time</TableHead><TableHead>Mocks</TableHead></TableRow></TableHeader>
              <TableBody>{data.questionStats.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-xs truncate text-xs">{q.text.slice(0, 70)}…</TableCell>
                  <TableCell className="text-xs">{q.subject[0]}</TableCell>
                  <TableCell className="text-xs">{q.attempts}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${(q.correctRate ?? 0) < 25 ? 'text-[var(--wrong)]' : (q.correctRate ?? 0) > 75 ? 'text-[var(--correct)]' : ''}`}>{fmtPercent(q.correctRate, 0)}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{q.avgTimeSeconds ? `${Math.round(q.avgTimeSeconds)}s` : '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{q.mockNumbers.map(String).join(',')}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table></ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ================= shared bits =================
function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">{text}</div>
}
function SkeletonGrid() {
  return <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
    <Skeleton className="h-48" />
  </div>
}
function MiniList({ title, items }: { title: string; items: Array<{ main: string; sub: string }> }) {
  return (
    <Card><CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? <p className="text-xs text-muted-foreground/60">Nothing yet.</p> : items.map((it, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2 text-xs">
            <span className="truncate">{it.main}</span>
            <span className="shrink-0 text-muted-foreground">{it.sub}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
