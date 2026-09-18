import 'server-only'
// ============================================================================
// Shared backend service — attempt lifecycle, scoring, DTO mappers, chat
// notification fan-out. Owned by backend agent (T2). Routes under /api use
// these helpers so the server-side timer + scoring rules live in ONE place.
// ============================================================================

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import type { User, Mock, GroupMember, GroupMessage, DirectMessage, Notification } from '@prisma/client'
import type {
  AdminQuestionDTO, AnalysisFull, AttemptFull, AttemptStatus, ChatMessageDTO, DiagramSpec, Difficulty,
  GroupDTO, MistakeTag, MockSummary, NotificationDTO, PublicUser, QuestionClient,
  ResultFull, Section, SolutionItem, Subject, SubjectScore, UserRole, UserStatus,
} from '@/lib/types'
import { AVOIDABLE_TAGS, SUBJECT_ORDER } from '@/lib/types'
import { checkAnswer } from '@/lib/scoring'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { SESSION_COOKIE } from '@/lib/auth'
import { z } from 'zod'

export const ATTEMPT_INCLUDE = {
  mock: {
    include: {
      questions: {
        include: { question: { include: { chapter: true, topic: true } } },
        orderBy: { order: 'asc' as const },
      },
    },
  },
  answers: { include: { question: { include: { chapter: true, topic: true } } } },
} satisfies Prisma.AttemptInclude

export type LoadedAttempt = Prisma.AttemptGetPayload<{ include: typeof ATTEMPT_INCLUDE }>
export type GroupWithOwner = Prisma.GroupGetPayload<{ include: { owner: true } }>

// ============ small utilities ============

export function istDayStart(t: Date): Date {
  const IST = 5.5 * 3600_000
  const d = new Date(t.getTime() + IST)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - IST)
}

export function round2(n: number): number { return Math.round(n * 100) / 100 }

export async function currentSessionId(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')
    const { payload } = await jwtVerify(token, secret)
    const p = payload as unknown as { sid?: string }
    return p.sid ?? null
  } catch { return null }
}

// ============ user / public DTO mappers ============

export function toPublicUser(u: User, includeEmail = false): PublicUser {
  const dto: PublicUser = {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    role: u.role as UserRole,
    status: u.status as UserStatus,
    bio: u.bio,
    targetYear: u.targetYear,
    profilePublic: u.profilePublic,
    leaderboardVisible: u.leaderboardVisible,
    createdAt: u.createdAt.toISOString(),
  }
  if (includeEmail) dto.email = u.email
  return dto
}

export function senderDto(u: Pick<User, 'username' | 'displayName' | 'avatarUrl'>) {
  return { username: u.username, displayName: u.displayName, avatarUrl: u.avatarUrl }
}

// ============ mock summaries ============

export async function buildMockSummaries(mocks: Mock[], userId: string | null): Promise<MockSummary[]> {
  const ids = mocks.map(m => m.id)
  const now = Date.now()
  const [participantRows, myAttempts] = await Promise.all([
    ids.length
      ? db.attempt.groupBy({ by: ['mockId'], where: { mockId: { in: ids }, status: 'SUBMITTED' }, _count: { _all: true } })
      : Promise.resolve([] as Array<{ mockId: string; _count: { _all: number } }>),
    userId && ids.length
      ? db.attempt.findMany({ where: { userId, mockId: { in: ids } }, select: { id: true, mockId: true, status: true, score: true } })
      : Promise.resolve([] as Array<{ id: string; mockId: string; status: string; score: number | null }>),
  ])
  const participantMap = new Map(participantRows.map(r => [r.mockId, r._count._all]))
  const mineMap = new Map(myAttempts.map(a => [a.mockId, a]))
  return mocks.map(m => {
    const unlocked = m.status === 'PUBLISHED' && m.scheduledAt.getTime() <= now
    const mine = mineMap.get(m.id)
    return {
      id: m.id,
      mockNumber: m.mockNumber,
      title: m.title,
      scheduledAt: m.scheduledAt.toISOString(),
      durationMinutes: m.durationMinutes,
      totalMarks: m.totalMarks,
      questionCount: m.questionCount,
      status: m.status as MockSummary['status'],
      publishedAt: m.publishedAt ? m.publishedAt.toISOString() : null,
      unlocked,
      unlockInMs: unlocked ? null : Math.max(0, m.scheduledAt.getTime() - now),
      myAttempt: mine ? { id: mine.id, status: mine.status as AttemptStatus, score: mine.score } : null,
      participantCount: participantMap.get(m.id) ?? 0,
    }
  })
}

// ============ attempt lifecycle ============

export async function loadAttempt(attemptId: string): Promise<LoadedAttempt | null> {
  return db.attempt.findUnique({ where: { id: attemptId }, include: ATTEMPT_INCLUDE })
}

export function isAttemptExpired(a: { status: string; deadlineAt: Date }): boolean {
  return a.status === 'IN_PROGRESS' && Date.now() > a.deadlineAt.getTime()
}

function questionClientOf(mq: Prisma.MockQuestionGetPayload<{ include: { question: true } }>): QuestionClient {
  const q = mq.question
  return {
    id: q.id,
    order: mq.order,
    subject: q.subject as Subject,
    section: q.section as Section,
    text: q.text,
    options: (q.options as string[] | null) ?? null,
    diagram: (q.diagram as DiagramSpec | null) ?? null,
    marksCorrect: q.marksCorrect,
    marksWrong: q.marksWrong,
  }
}

/** AttemptFull DTO: all 75 questions WITHOUT correctAnswer/solutionText, plus serverNow. */
export function buildAttemptFull(a: LoadedAttempt): AttemptFull {
  const answerMap = new Map(a.answers.map(ans => [ans.questionId, ans]))
  return {
    id: a.id,
    mockId: a.mockId,
    mock: {
      id: a.mock.id,
      mockNumber: a.mock.mockNumber,
      title: a.mock.title,
      totalMarks: a.mock.totalMarks,
      durationMinutes: a.mock.durationMinutes,
    },
    status: a.status as AttemptStatus,
    startedAt: a.startedAt.toISOString(),
    deadlineAt: a.deadlineAt.toISOString(),
    serverNow: new Date().toISOString(),
    autoSubmitted: a.autoSubmitted,
    questions: a.mock.questions.map(questionClientOf),
    answers: a.mock.questions.map(mq => {
      const ans = answerMap.get(mq.questionId)
      return {
        questionId: mq.questionId,
        selectedAnswer: ans?.selectedAnswer ?? null,
        markedForReview: ans?.markedForReview ?? false,
        visited: ans?.visited ?? false,
        timeSpentSeconds: ans?.timeSpentSeconds ?? 0,
      }
    }),
  }
}

/**
 * Server-authoritative scoring. Never trusts client-submitted values —
 * recomputes everything from stored AttemptAnswer rows via checkAnswer.
 * Sets per-question isCorrect (null = unattempted) and updates the Attempt row.
 */
export async function scoreAndSubmitAttempt(attemptId: string, auto: boolean): Promise<LoadedAttempt | null> {
  const a = await loadAttempt(attemptId)
  if (!a) return null
  if (a.status === 'SUBMITTED') return a
  const answerMap = new Map(a.answers.map(x => [x.questionId, x]))
  const subjectScore: Record<Subject, number> = { PHYSICS: 0, CHEMISTRY: 0, MATHEMATICS: 0 }
  let score = 0, correct = 0, wrong = 0, unattempted = 0, timeUsed = 0
  const ops: Prisma.PrismaPromise<unknown>[] = []
  for (const mq of a.mock.questions) {
    const q = mq.question
    const ans = answerMap.get(mq.questionId)
    const selected = ans?.selectedAnswer ?? null
    const attempted = !!(selected && selected.trim() !== '')
    const isCorrect = attempted ? checkAnswer(selected, q.correctAnswer, q.section) : null
    if (isCorrect === true) { correct++; score += q.marksCorrect; subjectScore[q.subject as Subject] += q.marksCorrect }
    else if (isCorrect === false) { wrong++; score += q.marksWrong; subjectScore[q.subject as Subject] += q.marksWrong }
    else unattempted++
    if (ans) {
      timeUsed += ans.timeSpentSeconds
      ops.push(db.attemptAnswer.update({ where: { id: ans.id }, data: { isCorrect } }))
    }
  }
  const attemptedCount = correct + wrong
  const accuracy = attemptedCount > 0 ? round2((correct / attemptedCount) * 100) : null
  ops.push(db.attempt.update({
    where: { id: a.id },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
      autoSubmitted: auto || a.autoSubmitted,
      score,
      physicsScore: subjectScore.PHYSICS,
      chemistryScore: subjectScore.CHEMISTRY,
      mathsScore: subjectScore.MATHEMATICS,
      correctCount: correct,
      wrongCount: wrong,
      unattemptedCount: unattempted,
      accuracy,
      timeUsedSeconds: timeUsed,
    },
  }))
  await db.$transaction(ops)
  return loadAttempt(attemptId)
}

/** Auto-submit an IN_PROGRESS attempt whose deadline has passed (server timer). */
export async function maybeAutoSubmit(a: LoadedAttempt): Promise<LoadedAttempt> {
  if (isAttemptExpired(a)) return (await scoreAndSubmitAttempt(a.id, true)) ?? a
  return a
}

/** Rank among all submitted attempts of the mock: score desc, then earlier submit wins. */
export async function attemptRank(a: { mockId: string; score: number | null; submittedAt: Date | null }): Promise<{ rank: number; totalParticipants: number }> {
  const myScore = a.score ?? 0
  const [better, total] = await Promise.all([
    db.attempt.count({
      where: {
        mockId: a.mockId,
        status: 'SUBMITTED',
        OR: [
          { score: { gt: myScore } },
          { score: myScore, submittedAt: { lt: a.submittedAt ?? undefined } },
        ],
      },
    }),
    db.attempt.count({ where: { mockId: a.mockId, status: 'SUBMITTED' } }),
  ])
  return { rank: better + 1, totalParticipants: total }
}

function subjectScoresOf(a: LoadedAttempt): SubjectScore[] {
  const answerMap = new Map(a.answers.map(x => [x.questionId, x]))
  const agg = new Map<Subject, { score: number; correct: number; wrong: number; unattempted: number; time: number; total: number }>()
  for (const s of SUBJECT_ORDER) agg.set(s, { score: 0, correct: 0, wrong: 0, unattempted: 0, time: 0, total: 0 })
  for (const mq of a.mock.questions) {
    const q = mq.question
    const s = q.subject as Subject
    const e = agg.get(s)!
    e.total++
    const ans = answerMap.get(mq.questionId)
    const attempted = !!(ans?.selectedAnswer && ans.selectedAnswer.trim() !== '')
    const isCorrect = ans?.isCorrect ?? null
    if (isCorrect === true) { e.correct++; e.score += q.marksCorrect }
    else if (isCorrect === false) { e.wrong++; e.score += q.marksWrong }
    else e.unattempted++
    if (ans) e.time += ans.timeSpentSeconds
  }
  return SUBJECT_ORDER.map(s => {
    const e = agg.get(s)!
    const attempted = e.correct + e.wrong
    return {
      subject: s,
      score: e.score,
      correct: e.correct,
      wrong: e.wrong,
      unattempted: e.unattempted,
      accuracy: attempted > 0 ? round2((e.correct / attempted) * 100) : null,
      attemptRate: e.total > 0 ? round2((attempted / e.total) * 100) : 0,
      timeSpentSeconds: e.time,
    }
  })
}

export async function computeResultFull(a: LoadedAttempt): Promise<ResultFull> {
  const answerMap = new Map(a.answers.map(x => [x.questionId, x]))
  let negative = 0
  const questions = a.mock.questions.map(mq => {
    const q = mq.question
    const ans = answerMap.get(mq.questionId)
    const isCorrect = ans?.isCorrect ?? null
    const status: 'CORRECT' | 'WRONG' | 'UNATTEMPTED' = isCorrect === true ? 'CORRECT' : isCorrect === false ? 'WRONG' : 'UNATTEMPTED'
    if (status === 'WRONG') negative += -q.marksWrong
    return {
      questionId: mq.questionId,
      order: mq.order,
      subject: q.subject as Subject,
      status,
      timeSpentSeconds: ans?.timeSpentSeconds ?? 0,
      markedForReview: ans?.markedForReview ?? false,
    }
  })
  const attemptedCount = (a.correctCount ?? 0) + (a.wrongCount ?? 0)
  const totalQuestions = a.mock.questions.length || a.mock.questionCount
  const { rank, totalParticipants } = await attemptRank(a)
  return {
    attemptId: a.id,
    mock: { id: a.mock.id, mockNumber: a.mock.mockNumber, title: a.mock.title },
    score: a.score ?? 0,
    maxScore: a.mock.totalMarks,
    percentage: round2(((a.score ?? 0) / a.mock.totalMarks) * 100),
    correct: a.correctCount ?? 0,
    wrong: a.wrongCount ?? 0,
    unattempted: a.unattemptedCount ?? 0,
    accuracy: a.accuracy ?? null,
    attemptRate: totalQuestions > 0 ? round2((attemptedCount / totalQuestions) * 100) : 0,
    negativeMarks: negative,
    timeUsedSeconds: a.timeUsedSeconds ?? 0,
    submittedAt: (a.submittedAt ?? a.startedAt).toISOString(),
    autoSubmitted: a.autoSubmitted,
    subjects: subjectScoresOf(a),
    questions,
    rank,
    totalParticipants,
  }
}

export function buildAnalysisFull(a: LoadedAttempt): AnalysisFull {
  const answerMap = new Map(a.answers.map(x => [x.questionId, x]))
  const buckets = { correctFast: [] as string[], correctSlow: [] as string[], wrongFast: [] as string[], wrongSlow: [] as string[], unattempted: [] as string[], over2min: [] as string[], over3min: [] as string[], over5min: [] as string[] }
  const chapters = new Map<string, { chapterId: string; name: string; subject: Subject; attempted: number; correct: number; incorrect: number; unattempted: number; timeSum: number; score: number }>()
  const topics = new Map<string, { topicId: string; name: string; subject: Subject; attempted: number; correct: number; incorrect: number; unattempted: number; timeSum: number; score: number }>()
  const difficulties = new Map<string, { difficulty: Difficulty; attempted: number; correct: number; incorrect: number; unattempted: number; score: number }>()
  const mistakes: Array<{ questionId: string; order: number; tag: MistakeTag | null }> = []
  let avoidable = 0

  for (const mq of a.mock.questions) {
    const q = mq.question
    const ans = answerMap.get(mq.questionId)
    const selected = ans?.selectedAnswer ?? null
    const attempted = !!(selected && selected.trim() !== '')
    const isCorrect = ans?.isCorrect ?? null
    const time = ans?.timeSpentSeconds ?? 0
    const qid = mq.questionId

    if (isCorrect === true) {
      if (time <= 45) buckets.correctFast.push(qid)
      if (time >= 120) buckets.correctSlow.push(qid)
    } else if (isCorrect === false) {
      if (time <= 45) buckets.wrongFast.push(qid)
      if (time >= 120) buckets.wrongSlow.push(qid)
      // potential score: only WRONG questions tagged avoidable count (+5 each)
      if (ans?.mistakeTag && isAvoidableTag(ans.mistakeTag)) avoidable++
    } else {
      buckets.unattempted.push(qid)
    }
    if (time >= 120) buckets.over2min.push(qid)
    if (time >= 180) buckets.over3min.push(qid)
    if (time >= 300) buckets.over5min.push(qid)

    const score = isCorrect === true ? q.marksCorrect : isCorrect === false ? q.marksWrong : 0

    const ch = chapters.get(q.chapterId) ?? { chapterId: q.chapterId, name: q.chapter.name, subject: q.subject as Subject, attempted: 0, correct: 0, incorrect: 0, unattempted: 0, timeSum: 0, score: 0 }
    const tp = topics.get(q.topicId) ?? { topicId: q.topicId, name: q.topic.name, subject: q.subject as Subject, attempted: 0, correct: 0, incorrect: 0, unattempted: 0, timeSum: 0, score: 0 }
    const df = difficulties.get(q.difficulty) ?? { difficulty: q.difficulty as Difficulty, attempted: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0 }
    for (const t of [ch, tp, df]) {
      if (attempted) { t.attempted++; if (isCorrect === true) t.correct++; else t.incorrect++ } else t.unattempted++
    }
    ch.score += score; tp.score += score; df.score += score
    if (attempted) { ch.timeSum += time; tp.timeSum += time }
    chapters.set(q.chapterId, ch); topics.set(q.topicId, tp); difficulties.set(q.difficulty, df)
    mistakes.push({ questionId: qid, order: mq.order, tag: (ans?.mistakeTag as MistakeTag | null) ?? null })
  }

  const mapAgg = <T extends { attempted: number; correct: number; incorrect: number; unattempted: number }>(m: Map<string, T>) => [...m.values()].map(e => ({
    ...e,
    accuracy: e.attempted > 0 ? round2((e.correct / e.attempted) * 100) : null,
  }))

  const chapterAgg = mapAgg(chapters).map(e => ({ ...e, avgTimeSeconds: e.attempted > 0 ? Math.round(e.timeSum / e.attempted) : 0 }))
  const topicAgg = mapAgg(topics).map(e => ({ ...e, avgTimeSeconds: e.attempted > 0 ? Math.round(e.timeSum / e.attempted) : 0 }))
  for (const e of [...chapterAgg, ...topicAgg]) delete (e as { timeSum?: number }).timeSum
  const difficultyAgg = mapAgg(difficulties)

  const score = a.score ?? 0
  return {
    attemptId: a.id,
    timeBuckets: buckets,
    chapters: chapterAgg.sort((x, y) => y.score - x.score),
    topics: topicAgg.sort((x, y) => y.score - x.score),
    difficulty: difficultyAgg,
    subjects: subjectScoresOf(a),
    mistakes,
    potentialScore: { current: score, potential: score + 5 * avoidable, avoidableMistakes: avoidable },
  }
}

function isAvoidableTag(tag: string): boolean {
  return (AVOIDABLE_TAGS as string[]).includes(tag)
}

export function buildSolutions(a: LoadedAttempt): SolutionItem[] {
  const answerMap = new Map(a.answers.map(x => [x.questionId, x]))
  return a.mock.questions.map(mq => {
    const q = mq.question
    const ans = answerMap.get(mq.questionId)
    const isCorrect = ans?.isCorrect ?? null
    return {
      question: questionClientOf(mq),
      correctAnswer: q.correctAnswer,
      myAnswer: ans?.selectedAnswer ?? null,
      status: isCorrect === true ? 'CORRECT' : isCorrect === false ? 'WRONG' : 'UNATTEMPTED',
      solutionText: q.solutionText,
      formulaConcept: q.formulaConcept,
      chapter: q.chapter.name,
      topic: q.topic.name,
      difficulty: q.difficulty as Difficulty,
      sourceType: q.sourceType as SolutionItem['sourceType'],
      pyqYear: q.pyqYear,
      pyqShift: q.pyqShift,
      sourceNote: q.sourceNote,
      timeSpentSeconds: ans?.timeSpentSeconds ?? 0,
      mistakeTag: (ans?.mistakeTag as MistakeTag | null) ?? null,
    }
  })
}

// ============ group DTOs ============

export const DELETED_MESSAGE_TEXT = 'message removed by moderator'

export async function buildGroupDTOs(groups: GroupWithOwner[], viewerId: string | null): Promise<GroupDTO[]> {
  const ids = groups.map(g => g.id)
  const [memberCountRows, myMemberships] = await Promise.all([
    ids.length
      ? db.groupMember.groupBy({ by: ['groupId'], where: { groupId: { in: ids } }, _count: { _all: true } })
      : Promise.resolve([] as Array<{ groupId: string; _count: { _all: number } }>),
    viewerId && ids.length
      ? db.groupMember.findMany({ where: { userId: viewerId, groupId: { in: ids } } })
      : Promise.resolve([] as GroupMember[]),
  ])
  const memberCountMap = new Map<string, number>(memberCountRows.map(r => [r.groupId, r._count._all] as [string, number]))
  const myMap = new Map<string, GroupMember>(myMemberships.map(m => [m.groupId, m] as [string, GroupMember]))
  const dtos = await Promise.all(groups.map(async g => {
    const me: GroupMember | undefined = viewerId ? myMap.get(g.id) : undefined
    const [lastMessage, unreadCount] = await Promise.all([
      db.groupMessage.findFirst({ where: { groupId: g.id }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
      me && viewerId
        ? db.groupMessage.count({ where: { groupId: g.id, createdAt: { gt: me.lastReadAt }, NOT: { userId: viewerId } } })
        : Promise.resolve(0),
    ])
    return {
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      isPrivate: g.isPrivate,
      owner: { username: g.owner.username, displayName: g.owner.displayName },
      memberCount: memberCountMap.get(g.id) ?? 0,
      joined: !!me,
      muted: me?.muted ?? false,
      unreadCount,
      lastMessageAt: lastMessage?.createdAt.toISOString() ?? null,
      lastMessagePreview: lastMessage ? (lastMessage.deletedAt ? DELETED_MESSAGE_TEXT : lastMessage.content.slice(0, 80)) : null,
    }
  }))
  return dtos
}

export function groupMessageDto(
  m: GroupMessage & { user: User },
  replyTo: { id: string; sender: string; content: string } | null,
): ChatMessageDTO {
  return {
    id: m.id,
    groupId: m.groupId,
    sender: senderDto(m.user),
    content: m.deletedAt ? DELETED_MESSAGE_TEXT : m.content,
    replyTo,
    createdAt: m.createdAt.toISOString(),
    deleted: !!m.deletedAt,
    readAt: null,
  }
}

export function dmMessageDto(m: DirectMessage & { sender: User }): ChatMessageDTO {
  return {
    id: m.id,
    conversationId: m.conversationId,
    sender: senderDto(m.sender),
    content: m.deletedAt ? DELETED_MESSAGE_TEXT : m.content,
    replyTo: null,
    createdAt: m.createdAt.toISOString(),
    deleted: !!m.deletedAt,
    readAt: m.readAt ? m.readAt.toISOString() : null,
  }
}

export async function conversationDto(
  conv: Prisma.DirectConversationGetPayload<{ include: { userA: true; userB: true } }>,
  viewerId: string,
): Promise<{
  id: string
  other: { username: string; displayName: string | null; avatarUrl: string | null; online: boolean }
  lastMessage: { content: string; createdAt: string; mine: boolean; read: boolean } | null
  unreadCount: number
}> {
  const other = conv.userAId === viewerId ? conv.userB : conv.userA
  const [lastMessage, unreadCount] = await Promise.all([
    db.directMessage.findFirst({ where: { conversationId: conv.id }, include: { sender: true }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
    db.directMessage.count({ where: { conversationId: conv.id, senderId: { not: viewerId }, readAt: null } }),
  ])
  return {
    id: conv.id,
    other: { ...senderDto(other), online: false },
    lastMessage: lastMessage
      ? {
          content: lastMessage.deletedAt ? DELETED_MESSAGE_TEXT : lastMessage.content,
          createdAt: lastMessage.createdAt.toISOString(),
          mine: lastMessage.senderId === viewerId,
          read: !!lastMessage.readAt,
        }
      : null,
    unreadCount,
  }
}

// ============ notifications & chat-service fan-out ============

export function notificationDto(n: Notification): NotificationDTO {
  return {
    id: n.id,
    type: n.type as NotificationDTO['type'],
    title: n.title,
    body: n.body,
    link: n.link,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }
}

/** Fire-and-forget emit through the chat service internal API (no-op if service down). */
export function broadcastToRoom(event: string, room: string, payload: unknown): void {
  const key = process.env.INTERNAL_API_KEY
  if (!key) return
  const base = process.env.CHAT_INTERNAL_URL || 'http://localhost:3003'
  fetch(`${base}/internal/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-key': key },
    body: JSON.stringify({ event, room, payload }),
  }).catch(() => {})
}

export interface NotificationCreate {
  userId: string
  type: NotificationDTO['type']
  title: string
  body?: string | null
  link?: string | null
  actorId?: string | null
  groupId?: string | null
  conversationId?: string | null
  mockId?: string | null
}

export async function createNotifications(items: NotificationCreate[]): Promise<Notification[]> {
  if (items.length === 0) return []
  const rows = await Promise.all(items.map(item =>
    db.notification.create({ data: { ...item, body: item.body ?? null, link: item.link ?? null, actorId: item.actorId ?? null, groupId: item.groupId ?? null, conversationId: item.conversationId ?? null, mockId: item.mockId ?? null } }),
  ))
  rows.forEach((row, i) => broadcastToRoom('notification:new', `user:${items[i].userId}`, notificationDto(row)))
  return rows
}

export function parseMentions(content: string): string[] {
  const out = new Set<string>()
  for (const m of content.matchAll(/@([a-z0-9_]{3,20})/gi)) out.add(m[1].toLowerCase())
  return [...out]
}

// ============ admin: questions & moderation ============

export const questionInputSchema = z.object({
  subject: z.enum(['PHYSICS', 'CHEMISTRY', 'MATHEMATICS']),
  section: z.enum(['A', 'B']),
  text: z.string().trim().min(10).max(4000),
  options: z.array(z.string().trim().min(1).max(1000)).length(4).nullable().optional(),
  correctAnswer: z.string().trim().min(1).max(64),
  solutionText: z.string().trim().min(30).max(20000),
  formulaConcept: z.string().trim().min(2).max(500),
  difficulty: z.enum(['EASY', 'MODERATE', 'HARD', 'VERY_HARD']),
  chapterId: z.string().min(1),
  topicId: z.string().min(1),
  sourceType: z.enum(['PYQ', 'ORIGINAL']),
  pyqYear: z.number().int().min(1990).max(2100).nullable().optional(),
  pyqShift: z.string().trim().max(60).nullable().optional(),
  sourceNote: z.string().trim().max(300).nullable().optional(),
  diagram: z.any().nullable().optional(),
  isVerified: z.boolean().optional(),
  marksCorrect: z.number().int().min(1).max(10).optional(),
  marksWrong: z.number().int().min(-10).max(0).optional(),
})

export type QuestionInput = z.infer<typeof questionInputSchema>

/** Validate question shape beyond zod: MCQ answer letter + options, numeric answer for section B. */
export function validateQuestionSemantics(input: QuestionInput): string | null {
  if (input.section === 'A') {
    const opts = input.options ?? null
    if (!opts) return 'Section A questions require 4 options'
    if (new Set(opts.map(o => o.trim())).size !== opts.length) return 'Options must be unique'
    if (!['A', 'B', 'C', 'D'].includes(input.correctAnswer)) return 'MCQ correctAnswer must be A, B, C or D'
  } else {
    if (input.options) return 'Section B (numerical) questions must not have options'
    if (!/^-?\d+(\.\d+)?$/.test(input.correctAnswer)) return 'Numerical correctAnswer must be a plain number'
  }
  return null
}

export async function adminQuestionDtos(
  questions: Array<Prisma.QuestionGetPayload<{ include: { chapter: true; topic: true } }>>,
): Promise<AdminQuestionDTO[]> {
  const ids = questions.map(q => q.id)
  if (ids.length === 0) return []
  const [links, statRows] = await Promise.all([
    db.mockQuestion.findMany({ where: { questionId: { in: ids } }, include: { mock: { select: { mockNumber: true } } } }),
    db.$queryRaw<Array<{ questionId: string; attempts: bigint; correct: bigint; avgTime: number | null }>>`
      SELECT aa.questionId, COUNT(*) as attempts,
             SUM(CASE WHEN aa.isCorrect = TRUE THEN 1 ELSE 0 END) as correct,
             AVG(aa.timeSpentSeconds) as avgTime
      FROM AttemptAnswer aa JOIN Attempt a ON a.id = aa.attemptId
      WHERE a.status = 'SUBMITTED' AND aa.selectedAnswer IS NOT NULL AND aa.questionId IN (${Prisma.join(ids)})
      GROUP BY aa.questionId`,
  ])
  const usedInMap = new Map<string, number[]>()
  for (const link of links) {
    const list = usedInMap.get(link.questionId) ?? []
    list.push(link.mock.mockNumber)
    usedInMap.set(link.questionId, list)
  }
  const statMap = new Map(statRows.map(r => [r.questionId, r]))
  return questions.map(q => {
    const stat = statMap.get(q.id)
    const attempts = Number(stat?.attempts ?? 0)
    const correct = Number(stat?.correct ?? 0)
    return {
      id: q.id,
      subject: q.subject as AdminQuestionDTO['subject'],
      section: q.section as AdminQuestionDTO['section'],
      text: q.text,
      options: (q.options as string[] | null) ?? null,
      correctAnswer: q.correctAnswer,
      solutionText: q.solutionText,
      formulaConcept: q.formulaConcept,
      difficulty: q.difficulty as AdminQuestionDTO['difficulty'],
      chapterId: q.chapterId,
      chapterName: q.chapter.name,
      topicId: q.topicId,
      topicName: q.topic.name,
      sourceType: q.sourceType as AdminQuestionDTO['sourceType'],
      pyqYear: q.pyqYear,
      pyqShift: q.pyqShift,
      sourceNote: q.sourceNote,
      diagram: (q.diagram as DiagramSpec | null) ?? null,
      isVerified: q.isVerified,
      usedIn: (usedInMap.get(q.id) ?? []).sort((a, b) => a - b),
      stats: stat
        ? {
            attempts,
            correctRate: attempts > 0 ? round2((correct / attempts) * 100) : null,
            avgTimeSeconds: stat.avgTime != null ? Math.round(Number(stat.avgTime)) : null,
          }
        : null,
    }
  })
}

export async function logModeration(
  adminId: string,
  actionType: string,
  targetType: string,
  targetId: string,
  note?: string | null,
) {
  await db.moderationAction.create({
    data: { adminId, actionType, targetType, targetId, note: note ?? null },
  }).catch(() => {})
}
