// ============================================================================
// SHARED CONTRACTS — single source of truth for backend + frontend agents.
// DO NOT change shapes without orchestrator approval (note in worklog.md).
// ============================================================================

export type Subject = 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS'
export type Section = 'A' | 'B' // A = MCQ, B = numerical
export type Difficulty = 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD'
export type SourceType = 'PYQ' | 'ORIGINAL'
export type MistakeTag =
  | 'CONCEPT_GAP' | 'FORMULA_ERROR' | 'CALCULATION_ERROR' | 'SILLY_MISTAKE'
  | 'MISREAD_QUESTION' | 'TIME_PRESSURE' | 'GUESS' | 'OTHER'
export type MockStatus = 'DRAFT' | 'PUBLISHED' | 'RETRACTED'
export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED'
export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED'

export const SUBJECT_LABEL: Record<Subject, string> = {
  PHYSICS: 'Physics', CHEMISTRY: 'Chemistry', MATHEMATICS: 'Mathematics',
}
export const SUBJECT_ORDER: Subject[] = ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS']
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: 'Easy', MODERATE: 'Moderate', HARD: 'Hard', VERY_HARD: 'Very Hard',
}
export const MISTAKE_TAG_LABEL: Record<MistakeTag, string> = {
  CONCEPT_GAP: 'Concept gap', FORMULA_ERROR: 'Formula error', CALCULATION_ERROR: 'Calculation error',
  SILLY_MISTAKE: 'Silly mistake', MISREAD_QUESTION: 'Misread question', TIME_PRESSURE: 'Time pressure',
  GUESS: 'Guess', OTHER: 'Other',
}
/** Mistakes tagged with these are treated as avoidable for potential-score calc. */
export const AVOIDABLE_TAGS: MistakeTag[] = ['FORMULA_ERROR', 'CALCULATION_ERROR', 'SILLY_MISTAKE', 'MISREAD_QUESTION']

// ============ DIAGRAM SPECS (rendered by src/components/diagram) ============

export type DiagramSpec =
  | GraphDiagram | CircuitDiagram | RayDiagram | FbdDiagram | WaveDiagram
  | FieldDiagram | GeometryDiagram | BarsDiagram | TableDiagram
  | MoleculeDiagram | OrganicDiagram | ApparatusDiagram | V3dDiagram

export interface GraphDiagram {
  kind: 'graph'
  title?: string
  xAxis: AxisSpec
  yAxis: AxisSpec
  curves: Array<{
    type: 'line' | 'curve' | 'points'
    points: Array<[number, number]>
    color?: string
    dashed?: boolean
    label?: string
  }>
  markers?: Array<{ x: number; y: number; label?: string; color?: string }>
  shadedRegions?: Array<{ points: Array<[number, number]>; color?: string; label?: string }>
  showGrid?: boolean
  square?: boolean // equal aspect (default true for geometry-like graphs)
}
export interface AxisSpec { label?: string; min: number; max: number; ticks?: number[] }

export interface CircuitDiagram {
  kind: 'circuit'
  components: Array<CircuitComponent>
  labels?: string[]
}
export type CircuitComponent =
  | { type: 'wire'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'junction'; x: number; y: number }
  | { type: 'resistor' | 'inductor' | 'capacitor' | 'bulb'; x1: number; y1: number; x2: number; y2: number; label?: string; value?: string }
  | { type: 'battery' | 'cell' | 'acsource'; x1: number; y1: number; x2: number; y2: number; label?: string; value?: string }
  | { type: 'switch'; x1: number; y1: number; x2: number; y2: number; label?: string; closed?: boolean }
  | { type: 'ammeter' | 'voltmeter'; x1: number; y1: number; x2: number; y2: number; label?: string; value?: string }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; label?: string; color?: string } // current/direction arrow (R5-b2, additive)
  | { type: 'diode'; x1: number; y1: number; x2: number; y2: number; label?: string; value?: string } // semiconductor diode, forward dir a→b (R5-b3, additive)

export interface RayDiagram {
  kind: 'ray'
  elements: Array<{
    type: 'lens-convex' | 'lens-concave' | 'mirror-concave' | 'mirror-convex' | 'mirror-plane' | 'prism' | 'object' | 'screen' | 'barrier'
    x: number; y?: number; height?: number; width?: number; label?: string; focal?: number
  }>
  rays: Array<{ from: [number, number]; to: [number, number]; dashed?: boolean; label?: string; color?: string }>
  axis?: boolean
  axisLabel?: [string, string]
}

export interface FbdDiagram {
  kind: 'fbd'
  bodies: Array<{
    type: 'block' | 'incline' | 'rod' | 'pulley' | 'string' | 'ground' | 'wall' | 'sphere' | 'cart' | 'spring'
    x: number; y: number; w?: number; h?: number; angle?: number; label?: string; r?: number
    x2?: number; y2?: number // spring coil endpoint (R5-b3, additive; start = x,y)
  }>
  forces: Array<{ from: [number, number]; to: [number, number]; label?: string; color?: string; dashed?: boolean }>
  dims?: Array<{ from: [number, number]; to: [number, number]; label?: string }> // dimension lines
}

export interface WaveDiagram {
  kind: 'wave'
  waves: Array<{ type: 'sine'; amplitude: number; cycles: number; phase?: number; label?: string; color?: string; dashed?: boolean }>
  xAxis?: { label?: string }
  yAxis?: { label?: string }
  title?: string
}

export interface FieldDiagram {
  kind: 'field'
  bounds?: { xMin: number; xMax: number; yMin: number; yMax: number }
  charges: Array<{ x: number; y: number; q: number; label?: string }> // q in units of +1/-1 etc.
  vectors?: Array<{ x: number; y: number; label?: string }> // extra field vectors at points
  showLines?: boolean
}

export interface GeometryDiagram {
  kind: 'geometry'
  xRange: [number, number]
  yRange: [number, number]
  elements: Array<GeometryElement>
  showGrid?: boolean
  square?: boolean
  title?: string
}
export type GeometryElement =
  | { type: 'point'; x: number; y: number; label?: string; labelPos?: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' }
  | { type: 'line'; from: [number, number]; to: [number, number]; label?: string; color?: string; dashed?: boolean }
  | { type: 'segment'; from: [number, number]; to: [number, number]; label?: string; color?: string; dashed?: boolean }
  | { type: 'circle'; cx: number; cy: number; r: number; label?: string; color?: string; dashed?: boolean; fill?: string }
  | { type: 'ellipse'; cx: number; cy: number; a: number; b: number; label?: string; color?: string; dashed?: boolean; rotate?: number }
  | { type: 'parabola'; vertex: [number, number]; a: number; xRange: [number, number]; label?: string; color?: string; dashed?: boolean }
  | { type: 'hyperbola'; cx: number; cy: number; a: number; b: number; branch: 'LR' | 'TB'; label?: string; color?: string; dashed?: boolean }
  | { type: 'vector'; from: [number, number]; to: [number, number]; label?: string; color?: string }
  | { type: 'label'; x: number; y: number; text: string; color?: string }
  | { type: 'angleArc'; at: [number, number]; fromDeg: number; toDeg: number; r?: number; label?: string }
  | { type: 'polygon'; points: Array<[number, number]>; label?: string; color?: string; fill?: string }

export interface BarsDiagram {
  kind: 'bars'
  title?: string
  categories: string[]
  series: Array<{ name?: string; values: number[]; color?: string }>
  yAxis: { label?: string; min?: number; max?: number }
  horizontal?: boolean
  stacked?: boolean
}

export interface TableDiagram {
  kind: 'table'
  headers: string[]
  rows: Array<Array<string | number>>
  caption?: string
  highlightCells?: Array<[number, number]> // [rowIdx, colIdx]
}

export interface MoleculeDiagram {
  kind: 'molecule'
  atoms: Array<{ sym: string; x: number; y: number; label?: string; charge?: string }>
  bonds: Array<{ a: number; b: number; order?: 1 | 2 | 3; type?: 'plain' | 'dashed' | 'wedge' | 'hash' }>
  lonePairs?: Array<{ atom: number; count: number; angles?: number[] }>
  caption?: string
}

export interface OrganicDiagram {
  kind: 'organic'
  parts: Array<OrganicPart>
  caption?: string
}
export type OrganicPart =
  | { type: 'ring'; x: number; y: number; ringSize?: number; label?: string; hetero?: Array<[number, string]>; aromatic?: boolean; substituents?: Array<{ position: number; label: string; bond?: 'single' | 'double' | 'wedge' | 'hash' | 'plain' }> }
  | { type: 'chain'; x: number; y: number; atoms: Array<{ sym: string; dir?: 'up' | 'down' }>; label?: string; double?: number[] } // double[i]: bond i→i+1 is double (R5-b2, additive)
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; label?: string; labelAbove?: boolean }
  | { type: 'text'; x: number; y: number; text: string; bold?: boolean }
  | { type: 'plus'; x: number; y: number }
  | { type: 'bracket'; x: number; y: number; w?: number; h?: number; label?: string }

export interface ApparatusDiagram {
  kind: 'apparatus'
  parts: Array<ApparatusPart>
  caption?: string
}
export type ApparatusPart =
  | { type: 'flask' | 'beaker' | 'testtube' | 'burette' | 'pipette' | 'burner' | 'thermometer' | 'tube' | 'condenser' | 'filter' | 'funnel'; x: number; y: number; w?: number; h?: number; label?: string; fill?: number }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; label?: string; color?: string; dashed?: boolean }
  | { type: 'label'; x: number; y: number; text: string; bold?: boolean }
  | { type: 'wire'; x1: number; y1: number; x2: number; y2: number; label?: string }

export interface V3dDiagram {
  kind: 'v3d'
  axesLength?: number
  points?: Array<{ x: number; y: number; z: number; label?: string; color?: string }>
  vectors?: Array<{ from?: [number, number, number]; to: [number, number, number]; label?: string; color?: string }>
  planes?: Array<{ points: Array<[number, number, number]>; label?: string; color?: string; opacity?: number }>
  lines?: Array<{ from: [number, number, number]; to: [number, number, number]; label?: string; dashed?: boolean; color?: string }>
  showGrid?: boolean
}

// ============ API DTOs ============

export interface PublicUser {
  id: string
  email?: string // only on /api/auth/me
  username: string
  displayName: string | null
  avatarUrl: string | null
  role: UserRole
  status: UserStatus
  bio: string | null
  targetYear: number | null
  profilePublic: boolean
  leaderboardVisible: boolean
  createdAt: string
}

export interface MockSummary {
  id: string
  mockNumber: number
  title: string
  scheduledAt: string // ISO — unlock at 00:00 IST of scheduled date
  durationMinutes: number
  totalMarks: number
  questionCount: number
  status: MockStatus
  publishedAt: string | null
  unlocked: boolean // scheduledAt <= now && published
  unlockInMs: number | null
  myAttempt: { id: string; status: AttemptStatus; score: number | null } | null
  participantCount: number
}

export interface QuestionClient {
  id: string
  order: number // 1..75
  subject: Subject
  section: Section
  text: string // markdown + $LaTeX$
  options: string[] | null // section A only
  diagram: DiagramSpec | null
  marksCorrect: number
  marksWrong: number
}

export interface AttemptAnswerState {
  questionId: string
  selectedAnswer: string | null
  markedForReview: boolean
  visited: boolean
  timeSpentSeconds: number
}

export interface AttemptFull {
  id: string
  mockId: string
  mock: { id: string; mockNumber: number; title: string; totalMarks: number; durationMinutes: number }
  status: AttemptStatus
  startedAt: string
  deadlineAt: string
  serverNow: string
  autoSubmitted: boolean
  questions: QuestionClient[]
  answers: AttemptAnswerState[]
}

export interface SubjectScore {
  subject: Subject
  score: number
  correct: number
  wrong: number
  unattempted: number
  accuracy: number | null // %
  attemptRate: number // % attempted
  timeSpentSeconds: number
}

export interface ResultFull {
  attemptId: string
  mock: { id: string; mockNumber: number; title: string }
  score: number
  maxScore: number
  percentage: number
  correct: number
  wrong: number
  unattempted: number
  accuracy: number | null
  attemptRate: number
  negativeMarks: number // absolute value of penalty
  timeUsedSeconds: number
  submittedAt: string
  autoSubmitted: boolean
  subjects: SubjectScore[]
  questions: Array<{ questionId: string; order: number; subject: Subject; status: 'CORRECT' | 'WRONG' | 'UNATTEMPTED'; timeSpentSeconds: number; markedForReview: boolean }>
  rank: number | null // rank in mock at time of view
  totalParticipants: number
}

export interface AnalysisFull {
  attemptId: string
  timeBuckets: { correctFast: string[]; correctSlow: string[]; wrongFast: string[]; wrongSlow: string[]; unattempted: string[]; over2min: string[]; over3min: string[]; over5min: string[] } // questionIds
  chapters: Array<{ chapterId: string; name: string; subject: Subject; attempted: number; correct: number; incorrect: number; unattempted: number; accuracy: number | null; avgTimeSeconds: number; score: number }>
  topics: Array<{ topicId: string; name: string; subject: Subject; attempted: number; correct: number; incorrect: number; unattempted: number; accuracy: number | null; avgTimeSeconds: number; score: number }>
  difficulty: Array<{ difficulty: Difficulty; attempted: number; correct: number; incorrect: number; unattempted: number; accuracy: number | null; score: number }>
  subjects: SubjectScore[]
  mistakes: Array<{ questionId: string; order: number; tag: MistakeTag | null }>
  potentialScore: { current: number; potential: number; avoidableMistakes: number }
}

export interface SolutionItem {
  question: QuestionClient
  correctAnswer: string
  myAnswer: string | null
  status: 'CORRECT' | 'WRONG' | 'UNATTEMPTED'
  solutionText: string
  formulaConcept: string
  chapter: string
  topic: string
  difficulty: Difficulty
  sourceType: SourceType
  pyqYear: number | null
  pyqShift: string | null
  sourceNote: string | null
  timeSpentSeconds: number
  mistakeTag: MistakeTag | null
}

export interface LeaderboardEntry {
  rank: number
  username: string
  displayName: string | null
  avatarUrl: string | null
  score: number
  accuracy: number | null
  attempts: number
  timeUsedSeconds: number | null
  submittedAt: string | null
}
export interface LeaderboardResponse {
  scope: 'current' | 'weekly' | 'monthly' | 'overall' | 'allmock'
  mockNumber: number | null
  updatedAt: string
  entries: LeaderboardEntry[]
  me: { rank: number | null; entry: LeaderboardEntry | null }
}

export interface PublicProfile {
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  targetYear: number | null
  createdAt: string
  stats: {
    mocksCompleted: number
    averageScore: number | null
    bestScore: number | null
    accuracy: number | null
    streak: number
    bestRank: number | null
  }
  recentAttempts: Array<{ mockNumber: number; mockTitle: string; score: number; submittedAt: string; rank: number | null }>
  /** sparse per-day study activity (days with ≥1 attempt started/submitted) for heatmap rendering */
  activity?: Array<{ date: string; count: number }>
  isSelf: boolean
  blocked: boolean
}

export interface GroupDTO {
  id: string
  name: string
  slug: string
  description: string | null
  isPrivate: boolean
  owner: { username: string; displayName: string | null }
  memberCount: number
  joined: boolean
  muted: boolean
  unreadCount: number
  lastMessageAt: string | null
  lastMessagePreview: string | null
}

export interface GroupMemberDTO {
  username: string
  displayName: string | null
  avatarUrl: string | null
  role: 'OWNER' | 'MODERATOR' | 'MEMBER'
  joinedAt: string
  online: boolean
}

export interface ChatMessageDTO {
  id: string
  groupId?: string
  conversationId?: string
  sender: { username: string; displayName: string | null; avatarUrl: string | null }
  content: string
  replyTo: { id: string; sender: string; content: string } | null
  createdAt: string
  deleted: boolean
  readAt: string | null // DM only
}

export interface ConversationDTO {
  id: string
  other: { username: string; displayName: string | null; avatarUrl: string | null; online: boolean }
  lastMessage: { content: string; createdAt: string; mine: boolean; read: boolean } | null
  unreadCount: number
}

export interface NotificationDTO {
  id: string
  type: 'GROUP_MESSAGE' | 'DIRECT_MESSAGE' | 'MENTION' | 'GROUP_ACTIVITY' | 'MOCK_ANNOUNCEMENT' | 'SYSTEM' | 'REPORT_STATUS'
  title: string
  body: string | null
  link: string | null
  readAt: string | null
  createdAt: string
}

export interface ValidationIssue { code: string; message: string; count?: number }
export interface MockValidation {
  passed: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  checks: { totalQuestions: number; physics: number; chemistry: number; maths: number; withSolution: number; withAnswer: number; withDiagram: number; withChapter: number; withTopic: number; withDifficulty: number; duplicates: number; marksValid: boolean }
  checkedAt: string
}

export interface AdminQuestionDTO {
  id: string
  subject: Subject
  section: Section
  text: string
  options: string[] | null
  correctAnswer: string
  solutionText: string
  formulaConcept: string
  difficulty: Difficulty
  chapterId: string
  chapterName: string
  topicId: string
  topicName: string
  sourceType: SourceType
  pyqYear: number | null
  pyqShift: string | null
  sourceNote: string | null
  diagram: DiagramSpec | null
  isVerified: boolean
  usedIn: number[]
  stats: { attempts: number; correctRate: number | null; avgTimeSeconds: number | null } | null
}

// Socket client events (chat service :3003)
export interface SocketEvents {
  // client -> server
  'group:join': (groupId: string) => void
  'group:leave': (groupId: string) => void
  'group:message': (groupId: string, content: string, replyToId?: string) => void
  'group:typing': (groupId: string) => void
  'group:read': (groupId: string) => void
  'dm:send': (conversationId: string, content: string) => void
  'dm:typing': (conversationId: string) => void
  'dm:read': (conversationId: string) => void
  // server -> client
  'group:message:new': (m: ChatMessageDTO) => void
  'dm:message:new': (m: ChatMessageDTO & { conversationId: string }) => void
  'notification:new': (n: NotificationDTO) => void
  'presence:update': (p: { onlineUsernames: string[] }) => void
  'connect_error': (err: Error) => void
}

// Generic API envelope — errors: { error: string } with proper status codes
export interface ApiError { error: string }
