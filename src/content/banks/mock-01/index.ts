import type { SeedBank } from '@/content/types'
import { PHYSICS_MOCK01 } from './physics'
import { CHEMISTRY_MOCK01 } from './chemistry'
import { MATHEMATICS_MOCK01 } from './math'

export const BANK: SeedBank = {
  mockNumber: 1,
  physics: PHYSICS_MOCK01,
  chemistry: CHEMISTRY_MOCK01,
  mathematics: MATHEMATICS_MOCK01,
}
