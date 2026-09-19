import type { SeedBank } from '@/content/types'
import { PHYSICS_MOCK03 } from './physics'
import { CHEMISTRY_MOCK03 } from './chemistry'
import { MATHEMATICS_MOCK03 } from './math'

export const BANK: SeedBank = {
  mockNumber: 3,
  physics: PHYSICS_MOCK03,
  chemistry: CHEMISTRY_MOCK03,
  mathematics: MATHEMATICS_MOCK03,
}
