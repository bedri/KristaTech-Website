export const SECURITY_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'"
})

export interface SanitizedBlockchainStatus {
  success: boolean
  height: number
  connections: number
  masternodes: {
    enabled: number
  }
  totalSupply: number
}

export const FALLBACK_BLOCKCHAIN_STATUS: Readonly<SanitizedBlockchainStatus> = Object.freeze({
  success: false,
  height: 997,
  connections: 0,
  masternodes: {
    enabled: 0
  },
  totalSupply: 19800
})

/**
 * Enforces Fetch Metadata resource isolation (Sec-Fetch-Site) per modern web security guidelines.
 * Rejects cross-site requests to non-navigational API endpoints while permitting same-origin,
 * same-site, direct user navigation, and legacy user agents that omit Sec-Fetch-Site.
 */
export function isAllowedFetchSite(
  secFetchSite: unknown,
  method = 'GET',
  secFetchMode?: unknown,
  secFetchDest?: unknown
): boolean {
  if (typeof secFetchSite !== 'string' || secFetchSite.trim() === '') {
    return true
  }

  const site = secFetchSite.trim().toLowerCase()
  if (site === 'same-origin' || site === 'same-site' || site === 'none') {
    return true
  }

  const normalizedMethod = typeof method === 'string' ? method.toUpperCase() : 'GET'
  const mode = typeof secFetchMode === 'string' ? secFetchMode.trim().toLowerCase() : ''
  const dest = typeof secFetchDest === 'string' ? secFetchDest.trim().toLowerCase() : ''

  if (
    site === 'cross-site' &&
    mode === 'navigate' &&
    normalizedMethod === 'GET' &&
    dest !== 'object' &&
    dest !== 'embed'
  ) {
    return true
  }

  return false
}

function toSafeNonNegativeInt(value: unknown, fallback: number, max = 210_000_000): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num) || num < 0) {
    return fallback
  }
  return Math.min(max, Math.floor(num))
}

/**
 * Validates and normalizes untrusted upstream daemon status payloads into a strictly typed DTO.
 */
export function sanitizeUpstreamStatus(raw: unknown): SanitizedBlockchainStatus {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      success: FALLBACK_BLOCKCHAIN_STATUS.success,
      height: FALLBACK_BLOCKCHAIN_STATUS.height,
      connections: FALLBACK_BLOCKCHAIN_STATUS.connections,
      masternodes: { enabled: FALLBACK_BLOCKCHAIN_STATUS.masternodes.enabled },
      totalSupply: FALLBACK_BLOCKCHAIN_STATUS.totalSupply
    }
  }

  const record = raw as Record<string, unknown>
  const hasValidHeight = typeof record.height === 'number' && Number.isFinite(record.height) && record.height >= 0

  if (!hasValidHeight) {
    return {
      success: false,
      height: FALLBACK_BLOCKCHAIN_STATUS.height,
      connections: FALLBACK_BLOCKCHAIN_STATUS.connections,
      masternodes: { enabled: FALLBACK_BLOCKCHAIN_STATUS.masternodes.enabled },
      totalSupply: FALLBACK_BLOCKCHAIN_STATUS.totalSupply
    }
  }

  const mnRaw =
    record.masternodes && typeof record.masternodes === 'object' && !Array.isArray(record.masternodes)
      ? (record.masternodes as Record<string, unknown>)
      : {}

  return {
    success: record.success !== false,
    height: toSafeNonNegativeInt(record.height, FALLBACK_BLOCKCHAIN_STATUS.height, 10_000_000),
    connections: toSafeNonNegativeInt(record.connections, 0, 100_000),
    masternodes: {
      enabled: toSafeNonNegativeInt(mnRaw.enabled, 0, 1_000_000)
    },
    totalSupply: toSafeNonNegativeInt(record.totalSupply, FALLBACK_BLOCKCHAIN_STATUS.totalSupply, 210_000_000)
  }
}
