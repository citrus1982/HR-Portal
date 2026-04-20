import { prisma } from '@/lib/db'
import { TransactionType, UnlockType } from '@prisma/client'

export const CREDIT_COSTS = {
  UNLOCK_CONTACT: 1,
  DOWNLOAD_CV: 2,
  DIRECT_OUTREACH: 3,
} as const

export async function getBalance(employerId: string): Promise<number> {
  const account = await prisma.creditAccount.findUnique({
    where: { employerId },
    select: { balance: true },
  })
  return account?.balance ?? 0
}

export async function addCredits(
  employerId: string,
  amount: number,
  description: string,
  type: TransactionType = TransactionType.PURCHASE,
  referenceId?: string
): Promise<void> {
  await prisma.$transaction([
    prisma.creditAccount.upsert({
      where: { employerId },
      create: { employerId, balance: amount },
      update: { balance: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        creditAccount: { connect: { employerId } },
        amount,
        type,
        description,
        referenceId,
      },
    }),
  ])
}

export async function debitCredits(
  employerId: string,
  amount: number,
  type: TransactionType,
  description: string,
  referenceId?: string
): Promise<void> {
  const account = await prisma.creditAccount.findUnique({ where: { employerId } })
  if (!account || account.balance < amount) {
    throw new Error('Insufficient credits')
  }

  await prisma.$transaction([
    prisma.creditAccount.update({
      where: { employerId },
      data: { balance: { decrement: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        creditAccount: { connect: { employerId } },
        amount: -amount,
        type,
        description,
        referenceId,
      },
    }),
  ])
}

export async function unlockProfile(
  employerId: string,
  candidateId: string,
  unlockType: UnlockType
): Promise<void> {
  // Check if already unlocked
  const existing = await prisma.profileUnlock.findFirst({
    where: { employerId, candidateId, unlockType },
  })
  if (existing) return

  const cost = CREDIT_COSTS[unlockType]
  const typeMap: Record<UnlockType, TransactionType> = {
    CONTACT_DETAILS: TransactionType.UNLOCK_CONTACT,
    CV_DOWNLOAD: TransactionType.DOWNLOAD_CV,
    DIRECT_OUTREACH: TransactionType.DIRECT_OUTREACH,
  }

  await debitCredits(
    employerId,
    cost,
    typeMap[unlockType],
    `Unlocked ${unlockType.toLowerCase().replace('_', ' ')} for candidate ${candidateId}`,
    candidateId
  )

  await prisma.profileUnlock.create({
    data: { employerId, candidateId, unlockType, creditsSpent: cost },
  })
}

export async function hasUnlocked(
  employerId: string,
  candidateId: string,
  unlockType: UnlockType
): Promise<boolean> {
  const unlock = await prisma.profileUnlock.findFirst({
    where: { employerId, candidateId, unlockType },
  })
  return !!unlock
}
