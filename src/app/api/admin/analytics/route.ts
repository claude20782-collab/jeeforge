import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'
import { round2 } from '@/lib/attempt-service'
import type { Difficulty, Subject } from '@/lib/types'

interface QuestionStatRow {
  id: string
  text: string
  subject: string
  difficulty: string
  attempts: bigint
  correctRate: number | null
  avgTime: number | null
}

interface SubjectRow {
  subject: string
  correct: bigint
  wrong: bigint
  avgTime: number | null
}

interface DifficultyRow {
  difficulty: string
  attempted: bigint
  correct: bigint
  avgTime: number | null
}

const SCORE_BUCKETS = Array.from({ length: 15 }, (_, i) => (i === 14 ? '280-300' : `${i * 20}-${i * 20 + 19}`))

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return forbidden()

  const [questionRows, subjectRows, difficultyRows, scoreAgg, submittedScores, mockLinks] = await Promise.all([
    db.$queryRawUnsafe<QuestionStatRow[]>( `
      SELECT q.id, q.text, q.subject, q.difficulty, COUNT(*) as attempts,
             (SUM(CASE WHEN aa.isCorrect = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) * 100 as correctRate,
             AVG(aa.timeSpentSeconds) as avgTime
      FROM AttemptAnswer aa
      JOIN Attempt a ON a.id = aa.attemptId AND a.status = 'SUBMITTED'
      JOIN Question q ON q.id = aa.questionId
      WHERE aa.selectedAnswer IS NOT NULL
      GROUP BY q.id, q.text, q.subject, q.difficulty
      HAVING COUNT(*) >= 10
      ORDER BY attempts DESC, q.id
    `),
    db.$queryRawUnsafe<SubjectRow[]>( `
      SELECT q.subject,
             SUM(CASE WHEN aa.isCorrect = 1 THEN 1 ELSE 0 END) as correct,
             SUM(CASE WHEN aa.isCorrect = 0 THEN 1 ELSE 0 END) as wrong,
             AVG(aa.timeSpentSeconds) as avgTime
      FROM AttemptAnswer aa
      JOIN Attempt a ON a.id = aa.attemptId AND a.status = 'SUBMITTED'
      JOIN Question q ON q.id = aa.questionId
      WHERE aa.selectedAnswer IS NOT NULL
      GROUP BY q.subject
    `),
    db.$queryRawUnsafe<DifficultyRow[]>( `
      SELECT q.difficulty,
             COUNT(*) as attempted,
             SUM(CASE WHEN aa.isCorrect = 1 THEN 1 ELSE 0 END) as correct,
             AVG(aa.timeSpentSeconds) as avgTime
      FROM AttemptAnswer aa
      JOIN Attempt a ON a.id = aa.attemptId AND a.status = 'SUBMITTED'
      JOIN Question q ON q.id = aa.questionId
      WHERE aa.selectedAnswer IS NOT NULL
      GROUP BY q.difficulty
    `),
    db.attempt.aggregate({ where: { status: 'SUBMITTED' }, _avg: { physicsScore: true, chemistryScore: true, mathsScore: true } }),
    db.attempt.findMany({ where: { status: 'SUBMITTED' }, select: { score: true } }),
    db.mockQuestion.findMany({ select: { questionId: true, mock: { select: { mockNumber: true } } } }),
  ])

  const mockNumbersByQuestion = new Map<string, number[]>()
  for (const link of mockLinks) {
    const list = mockNumbersByQuestion.get(link.questionId) ?? []
    list.push(link.mock.mockNumber)
    mockNumbersByQuestion.set(link.questionId, list)
  }

  const questionStats = questionRows.map(r => ({
    id: r.id,
    text: r.text.slice(0, 120),
    subject: r.subject as Subject,
    difficulty: r.difficulty as Difficulty,
    attempts: Number(r.attempts),
    correctRate: r.correctRate != null ? round2(Number(r.correctRate)) : null,
    avgTimeSeconds: r.avgTime != null ? Math.round(Number(r.avgTime)) : null,
    mockNumbers: (mockNumbersByQuestion.get(r.id) ?? []).sort((a, b) => a - b),
  }))

  const avgSubjectScore: Record<string, number | null> = {
    PHYSICS: scoreAgg._avg.physicsScore != null ? round2(scoreAgg._avg.physicsScore) : null,
    CHEMISTRY: scoreAgg._avg.chemistryScore != null ? round2(scoreAgg._avg.chemistryScore) : null,
    MATHEMATICS: scoreAgg._avg.mathsScore != null ? round2(scoreAgg._avg.mathsScore) : null,
  }
  const subjectAverages = subjectRows.map(r => {
    const correct = Number(r.correct)
    const wrong = Number(r.wrong)
    return {
      subject: r.subject as Subject,
      avgScore: avgSubjectScore[r.subject] ?? null,
      accuracy: correct + wrong > 0 ? round2((correct / (correct + wrong)) * 100) : null,
      avgTimeSeconds: r.avgTime != null ? Math.round(Number(r.avgTime)) : null,
    }
  })

  const difficultyAverages = difficultyRows.map(r => {
    const attempted = Number(r.attempted)
    const correct = Number(r.correct)
    return {
      difficulty: r.difficulty as Difficulty,
      attempted,
      accuracy: attempted > 0 ? round2((correct / attempted) * 100) : null,
      avgTimeSeconds: r.avgTime != null ? Math.round(Number(r.avgTime)) : null,
    }
  })

  // buckets of 20 marks: 0-19, 20-39, …, 280-300 (negative scores clamped into the first bucket)
  const bucketCounts = new Array(SCORE_BUCKETS.length).fill(0)
  for (const a of submittedScores) {
    const idx = Math.min(SCORE_BUCKETS.length - 1, Math.max(0, Math.floor((a.score ?? 0) / 20)))
    bucketCounts[idx]++
  }
  const scoreDistribution = SCORE_BUCKETS.map((bucket, i) => ({ bucket, count: bucketCounts[i] }))

  return ok({ questionStats, subjectAverages, difficultyAverages, scoreDistribution })
}
