import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  SECURITY_HEADERS,
  FALLBACK_BLOCKCHAIN_STATUS,
  isAllowedFetchSite,
  sanitizeUpstreamStatus
} from '../server/utils/statusSecurity.ts'

describe('Server Security Headers, Fetch Metadata & Upstream Sanitization (server/utils/statusSecurity.ts)', () => {
  describe('SECURITY_HEADERS', () => {
    it('defines immutable defense-in-depth HTTP security headers', () => {
      assert.ok(Object.isFrozen(SECURITY_HEADERS))
      assert.equal(SECURITY_HEADERS['X-Frame-Options'], 'SAMEORIGIN')
      assert.equal(SECURITY_HEADERS['X-Content-Type-Options'], 'nosniff')
      assert.equal(SECURITY_HEADERS['Referrer-Policy'], 'strict-origin-when-cross-origin')
      assert.equal(SECURITY_HEADERS['Cross-Origin-Opener-Policy'], 'same-origin-allow-popups')
      assert.equal(SECURITY_HEADERS['Cross-Origin-Resource-Policy'], 'same-origin')
      assert.match(SECURITY_HEADERS['Permissions-Policy'], /camera=\(\)/)
      assert.match(SECURITY_HEADERS['Content-Security-Policy'], /frame-ancestors 'self'/)
      assert.match(SECURITY_HEADERS['Content-Security-Policy'], /base-uri 'self'/)
      assert.match(SECURITY_HEADERS['Content-Security-Policy'], /object-src 'none'/)
    })
  })

  describe('isAllowedFetchSite (Fetch Metadata Resource Isolation)', () => {
    it('allows same-origin, same-site, none, and legacy requests without Sec-Fetch-Site', () => {
      assert.equal(isAllowedFetchSite('same-origin', 'GET', 'cors', 'empty'), true)
      assert.equal(isAllowedFetchSite('same-site', 'GET', 'cors', 'empty'), true)
      assert.equal(isAllowedFetchSite('none', 'GET', 'navigate', 'document'), true)
      assert.equal(isAllowedFetchSite(undefined, 'GET'), true)
      assert.equal(isAllowedFetchSite('', 'GET'), true)
    })

    it('allows top-level cross-site GET navigation but blocks cross-site API fetches and POSTs', () => {
      assert.equal(isAllowedFetchSite('cross-site', 'GET', 'navigate', 'document'), true)
      assert.equal(isAllowedFetchSite('cross-site', 'GET', 'cors', 'empty'), false)
      assert.equal(isAllowedFetchSite('cross-site', 'GET', 'no-cors', 'script'), false)
      assert.equal(isAllowedFetchSite('cross-site', 'POST', 'navigate', 'document'), false)
      assert.equal(isAllowedFetchSite('cross-site', 'GET', 'navigate', 'object'), false)
      assert.equal(isAllowedFetchSite('cross-site', 'GET', 'navigate', 'embed'), false)
    })
  })

  describe('sanitizeUpstreamStatus', () => {
    it('normalizes valid upstream daemon telemetry and strips unknown properties', () => {
      const raw = {
        success: true,
        height: 1542.8,
        connections: 12,
        masternodes: { enabled: 8, internalIp: '10.0.0.1' },
        totalSupply: 154200,
        debugStack: 'sensitive internal stack trace'
      }
      const sanitized = sanitizeUpstreamStatus(raw)
      assert.deepEqual(sanitized, {
        success: true,
        height: 1542,
        connections: 12,
        masternodes: { enabled: 8 },
        totalSupply: 154200
      })
      assert.equal('debugStack' in sanitized, false)
    })

    it('returns safe fallback status when upstream payload is null, malformed, or negative', () => {
      assert.deepEqual(sanitizeUpstreamStatus(null), FALLBACK_BLOCKCHAIN_STATUS)
      assert.deepEqual(sanitizeUpstreamStatus('<html>Error</html>'), FALLBACK_BLOCKCHAIN_STATUS)
      assert.deepEqual(sanitizeUpstreamStatus([]), FALLBACK_BLOCKCHAIN_STATUS)
      assert.deepEqual(sanitizeUpstreamStatus({ height: -50 }), FALLBACK_BLOCKCHAIN_STATUS)
      assert.deepEqual(sanitizeUpstreamStatus({ height: 'not-a-number' }), FALLBACK_BLOCKCHAIN_STATUS)
    })

    it('clamps excessive numeric fields to protocol maximums', () => {
      const sanitized = sanitizeUpstreamStatus({
        success: true,
        height: 999_999_999,
        connections: -5,
        masternodes: { enabled: -1 },
        totalSupply: 999_999_999_999
      })
      assert.equal(sanitized.height, 10_000_000)
      assert.equal(sanitized.connections, 0)
      assert.equal(sanitized.masternodes.enabled, 0)
      assert.equal(sanitized.totalSupply, 210_000_000)
    })
  })
})
