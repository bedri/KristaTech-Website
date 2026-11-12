export const SUPPORTED_LOCALES = ['tr', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const SUPPORTED_THEMES = ['light', 'dark'] as const
export type ThemeMode = (typeof SUPPORTED_THEMES)[number]

export const MAX_SAFE_BLOCK_HEIGHT = 10_000_000
export const MAX_SUPPLY_KRISTA = 210_000_000
export const MAX_LOCKTIME_BLOCKS = 5_256_000 // ~5 years at 30s/block
export const MASTERNODE_COLLATERAL = 4_200

export function sanitizeLocale(input: unknown, fallback: Locale = 'tr'): Locale {
  if (typeof input === 'string') {
    const normalized = input.trim().toLowerCase()
    if (normalized === 'tr' || normalized === 'en') {
      return normalized
    }
  }
  return fallback
}

export function sanitizeTheme(input: unknown, fallback: ThemeMode = 'light'): ThemeMode {
  if (typeof input === 'string') {
    const normalized = input.trim().toLowerCase()
    if (normalized === 'light' || normalized === 'dark') {
      return normalized
    }
  }
  return fallback
}

export function resolveInitialLocale(
  acceptLanguage?: string | null,
  browserLanguage?: string | null,
  fallback: Locale = 'tr'
): Locale {
  if (typeof acceptLanguage === 'string' && acceptLanguage.trim().length > 0) {
    const primaryTag = acceptLanguage.split(',')[0]?.trim().slice(0, 2).toLowerCase()
    if (primaryTag === 'tr' || primaryTag === 'en') {
      return primaryTag
    }
  }
  if (typeof browserLanguage === 'string' && browserLanguage.trim().length > 0) {
    const primaryTag = browserLanguage.trim().slice(0, 2).toLowerCase()
    if (primaryTag === 'tr' || primaryTag === 'en') {
      return primaryTag
    }
  }
  return fallback
}

export function sanitizeBlockHeight(input: unknown, fallback = 1): number {
  const num = typeof input === 'number' ? input : Number(input)
  if (!Number.isFinite(num)) {
    return Math.max(1, Math.min(MAX_SAFE_BLOCK_HEIGHT, Math.floor(fallback)))
  }
  return Math.max(1, Math.min(MAX_SAFE_BLOCK_HEIGHT, Math.floor(num)))
}

export interface MilestoneInfo {
  target: number
  prev: number
  eraName: string
  nextName: string
  remaining: number
  progress: number
}

export function calculateNextMilestone(heightInput: unknown, localeInput: unknown = 'tr'): MilestoneInfo {
  const h = sanitizeBlockHeight(heightInput, 997)
  const isTr = sanitizeLocale(localeInput) === 'tr'

  if (h < 200) {
    return {
      target: 200,
      prev: 1,
      eraName: isTr ? 'Aşama 1: Genesis ve MESCAL' : 'Phase 1: Genesis & MESCAL',
      nextName: isTr ? 'Aşama 2: PoS ve ADAM (Blok 200)' : 'Phase 2: PoS & ADAM (Block 200)',
      remaining: 200 - h,
      progress: Math.min(100, Math.max(2, (h / 200) * 100))
    }
  }

  if (h < 2000) {
    return {
      target: 2000,
      prev: 200,
      eraName: isTr ? 'Aşama 2 Aktif: PoS + ADAM VRF' : 'Phase 2 Active: PoS + ADAM VRF',
      nextName: isTr ? 'Aşama 3: PoBLS Çekilişi (Blok 2.000)' : 'Phase 3: PoBLS Lottery (Block 2,000)',
      remaining: 2000 - h,
      progress: Math.min(100, Math.max(5, ((h - 200) / 1800) * 100))
    }
  }

  if (h < 2200) {
    return {
      target: 2200,
      prev: 2000,
      eraName: isTr ? 'Aşama 3 Aktif: PoBLS Eşik Çekilişi' : 'Phase 3 Active: PoBLS Threshold Lottery',
      nextName: isTr ? 'Aşama 4: Model D Dağılımı (Blok 2.200)' : 'Phase 4: Model D Splits (Block 2,200)',
      remaining: 2200 - h,
      progress: Math.min(100, Math.max(5, ((h - 2000) / 200) * 100))
    }
  }

  if (h < 10000) {
    return {
      target: 10000,
      prev: 2200,
      eraName: isTr ? 'Aşama 4 Aktif: Tam Model D Konsensüsü' : 'Phase 4 Active: Full Model D Consensus',
      nextName: isTr ? 'Standart Emisyon (Blok 10.000)' : 'Standard Emission (Block 10,000)',
      remaining: 10000 - h,
      progress: Math.min(100, Math.max(10, ((h - 2200) / 7800) * 100))
    }
  }

  const quarterIndex = Math.floor((h - 10000) / 259200)
  const prev = 10000 + quarterIndex * 259200
  const target = prev + 259200
  return {
    target,
    prev,
    eraName: isTr
      ? `Aşama 4 Aktif: Tam Model D • Çeyrek #${quarterIndex + 1}`
      : `Phase 4 Active: Full Model D • Quarter #${quarterIndex + 1}`,
    nextName: isTr
      ? `Çeyrek #${quarterIndex + 2} Emisyon Geçişi (Blok ${target.toLocaleString('tr-TR')})`
      : `Quarter #${quarterIndex + 2} Emission Step (Block ${target.toLocaleString('en-US')})`,
    remaining: target - h,
    progress: Math.min(100, Math.max(2, ((h - prev) / 259200) * 100))
  }
}

export function calculateTotalBlockReward(heightInput: unknown): number {
  const raw = typeof heightInput === 'number' ? heightInput : Number(heightInput)
  if (!Number.isFinite(raw) || raw <= 1) {
    return 0
  }
  const h = sanitizeBlockHeight(raw, 1)
  if (h <= 1) return 0
  if (h <= 2200) return 40
  if (h <= 5000) return 30
  if (h < 10000) return 20

  const period = Math.floor((h - 10000) / 259200)
  const subsidy = 15.0 * Math.pow(0.981, period)
  return Math.max(0, parseFloat((Math.floor(subsidy * 1e8 + 0.5) / 1e8).toFixed(8)))
}

export function calculateEmissionEpochLabel(heightInput: unknown, localeInput: unknown = 'tr'): string {
  const raw = typeof heightInput === 'number' ? heightInput : Number(heightInput)
  const isTr = sanitizeLocale(localeInput) === 'tr'

  if (!Number.isFinite(raw) || raw <= 1) {
    return isTr ? 'Genesis Bloğu (0 Premine)' : 'Genesis Block (0 Premine)'
  }

  const h = sanitizeBlockHeight(raw, 1)
  if (h < 2200) return isTr ? 'Erken Başlangıç Dönemi (40 KRISTA)' : 'Early Bootstrap Era (40 KRISTA)'
  if (h === 2200) return isTr ? 'Model D Başlangıç Dönemi (40 KRISTA)' : 'Model D Bootstrap Era (40 KRISTA)'
  if (h <= 5000) return isTr ? 'Model D Başlangıç Dönemi (30 KRISTA)' : 'Model D Bootstrap Era (30 KRISTA)'
  if (h < 10000) return isTr ? 'Model D Geçiş Dönemi (20 KRISTA)' : 'Model D Transition Era (20 KRISTA)'

  const period = Math.floor((h - 10000) / 259200) + 1
  return isTr
    ? `Standart Emisyon • Çeyrek #${period} (%1.9 Azalma)`
    : `Standard Emission • Quarter #${period} (1.9% Decay)`
}

export interface ModelDSplitPercentages {
  dev: number
  mn: number
  quorum: number
  participants: number
  producer: number
}

export function calculateModelDSplits(heightInput: unknown): ModelDSplitPercentages {
  const raw = typeof heightInput === 'number' ? heightInput : Number(heightInput)
  if (!Number.isFinite(raw) || raw <= 1) {
    return {
      dev: 0.0,
      mn: 0.0,
      quorum: 0.0,
      participants: 0.0,
      producer: 0.0
    }
  }

  const h = sanitizeBlockHeight(raw, 1)
  const devPercent = 7.0
  const remaining = parseFloat((100.0 - devPercent).toFixed(4))

  if (h >= 2200) {
    return {
      dev: devPercent,
      mn: parseFloat((remaining * 0.35).toFixed(4)),
      quorum: parseFloat((remaining * 0.10).toFixed(4)),
      participants: parseFloat((remaining * 0.40).toFixed(4)),
      producer: parseFloat((remaining * 0.15).toFixed(4))
    }
  }

  if (h >= 200) {
    return {
      dev: devPercent,
      mn: 0.0,
      quorum: 0.0,
      participants: parseFloat((remaining * 0.40).toFixed(4)),
      producer: parseFloat((remaining * 0.60).toFixed(4))
    }
  }

  return {
    dev: devPercent,
    mn: 0.0,
    quorum: 0.0,
    participants: 0.0,
    producer: remaining
  }
}

export interface ModelDRewardAmounts {
  total: number
  dev: number
  mn: number
  quorum: number
  participants: number
  producer: number
}

export function calculateRewardAmounts(heightInput: unknown): ModelDRewardAmounts {
  const total = calculateTotalBlockReward(heightInput)
  const splits = calculateModelDSplits(heightInput)

  return {
    total,
    dev: parseFloat((total * (splits.dev / 100)).toFixed(4)),
    mn: parseFloat((total * (splits.mn / 100)).toFixed(4)),
    quorum: parseFloat((total * (splits.quorum / 100)).toFixed(4)),
    participants: parseFloat((total * (splits.participants / 100)).toFixed(4)),
    producer: parseFloat((total * (splits.producer / 100)).toFixed(4))
  }
}

export type MescalTemplate = 'escrow' | 'vesting' | 'token'

export interface MescalParamsInput {
  amount?: unknown
  locktime?: unknown
  refundAddress?: unknown
}

export interface SanitizedMescalParams {
  amount: number
  locktime: number
  refundAddress: string
}

export function sanitizeMescalParams(input: MescalParamsInput = {}): SanitizedMescalParams {
  const rawAmount = typeof input.amount === 'number' ? input.amount : Number(input.amount)
  const amount = Number.isFinite(rawAmount)
    ? Math.max(1, Math.min(MAX_SUPPLY_KRISTA, Math.floor(rawAmount)))
    : 250

  const rawLocktime = typeof input.locktime === 'number' ? input.locktime : Number(input.locktime)
  const locktime = Number.isFinite(rawLocktime)
    ? Math.max(1, Math.min(MAX_LOCKTIME_BLOCKS, Math.floor(rawLocktime)))
    : 2900

  const rawAddress = typeof input.refundAddress === 'string' ? input.refundAddress : ''
  const cleanedAddress = rawAddress.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 64)
  const refundAddress = cleanedAddress.length >= 6 ? cleanedAddress : 'KTNrvQkwv1Yo...CYv'

  return {
    amount,
    locktime,
    refundAddress
  }
}

export function generateMescalBytecode(templateInput: unknown, paramsInput: MescalParamsInput = {}): string {
  const template: MescalTemplate =
    templateInput === 'vesting' || templateInput === 'token' ? templateInput : 'escrow'
  const params = sanitizeMescalParams(paramsInput)

  if (template === 'escrow') {
    return `OP_MESCAL_HEADER <version:1> <template:COIN_LOCK_MINER>
<${params.amount}_KRISTA> OP_DROP
<${params.locktime}> OP_CHECKLOCKTIMEVERIFY OP_DROP
OP_DUP OP_HASH160 <"${params.refundAddress}"> OP_EQUALVERIFY OP_CHECKSIG`
  }

  if (template === 'vesting') {
    return `OP_MESCAL_HEADER <version:1> <template:LINEAR_VESTING>
OP_IF
  <2880> OP_CHECKSEQUENCEVERIFY OP_DROP
  OP_DUP OP_HASH160 <beneficiary_pkh> OP_EQUALVERIFY OP_CHECKSIG
OP_ELSE
  <${params.locktime}> OP_CHECKLOCKTIMEVERIFY OP_DROP
  OP_DUP OP_HASH160 <"${params.refundAddress}"> OP_EQUALVERIFY OP_CHECKSIG
OP_ENDIF`
  }

  return `OP_MESCAL_HEADER <version:1> <template:HTLC_ATOMIC_SWAP>
OP_IF
  OP_SHA256 <secret_hash_32b> OP_EQUALVERIFY
  OP_DUP OP_HASH160 <recipient_pkh> OP_EQUALVERIFY OP_CHECKSIG
OP_ELSE
  <${params.locktime}> OP_CHECKLOCKTIMEVERIFY OP_DROP
  OP_DUP OP_HASH160 <"${params.refundAddress}"> OP_EQUALVERIFY OP_CHECKSIG
OP_ENDIF`
}
