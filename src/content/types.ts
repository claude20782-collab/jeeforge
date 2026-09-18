import type { DiagramSpec, Difficulty, Section, SourceType, Subject } from '@/lib/types'

export interface SeedQuestion {
  subject: Subject
  section: Section // A = MCQ (options required), B = numerical (correctAnswer numeric)
  text: string // markdown + $LaTeX$
  options?: Array<string> // exactly 4 for section A
  correctAnswer: string // 'A'|'B'|'C'|'D' for A; canonical numeric string for B (e.g. "6", "-2.50")
  solutionText: string // COMPLETE step-by-step solution (>=30 chars, no placeholders ever)
  formulaConcept: string
  difficulty: Difficulty
  chapterSlug: string // must exist in src/content/chapters.ts for this subject
  topicSlug: string // must exist within chapter
  sourceType: SourceType
  pyqYear?: number // ONLY when genuinely a PYQ of that year — never invented
  pyqShift?: string // e.g. "27 Jun Shift 2"
  sourceNote?: string
  diagram?: DiagramSpec
}

export interface SeedBank {
  mockNumber: number
  physics: SeedQuestion[]
  chemistry: SeedQuestion[]
  mathematics: SeedQuestion[]
}
