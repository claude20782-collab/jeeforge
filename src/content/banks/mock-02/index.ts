import type { SeedBank } from '@/content/types'
import { PHYSICS_MOCK02 } from './physics'
import { CHEMISTRY_MOCK02 } from './chemistry'
import { MATHEMATICS_MOCK02 } from './math'

export const BANK: SeedBank = {
  mockNumber: 2,
  physics: PHYSICS_MOCK02,
  chemistry: CHEMISTRY_MOCK02,
  mathematics: MATHEMATICS_MOCK02,
}
