import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  sanitizeLocale,
  sanitizeTheme,
  resolveInitialLocale,
  sanitizeBlockHeight,
  calculateNextMilestone,
  calculateTotalBlockReward,
  calculateEmissionEpochLabel,
  calculateModelDSplits,
  calculateRewardAmounts,
  sanitizeMescalParams,
  generateMescalBytecode,
  MAX_SAFE_BLOCK_HEIGHT,
  MAX_SUPPLY_KRISTA,
  MAX_LOCKTIME_BLOCKS
} from '../app/utils/protocol.ts'

describe('Protocol & Cryptoeconomic Utilities (app/utils/protocol.ts)', () => {
  describe('sanitizeLocale & resolveInitialLocale', () => {
    it('accepts valid locales with case/whitespace normalization', () => {
      assert.equal(sanitizeLocale('tr'), 'tr')
      assert.equal(sanitizeLocale('EN'), 'en')
      assert.equal(sanitizeLocale('  Tr '), 'tr')
    })

    it('falls back safely on unsupported or malicious inputs', () => {
      assert.equal(sanitizeLocale('fr', 'tr'), 'tr')
      assert.equal(sanitizeLocale('__proto__', 'en'), 'en')
      assert.equal(sanitizeLocale('constructor', 'tr'), 'tr')
      assert.equal(sanitizeLocale('<script>alert(1)</script>', 'tr'), 'tr')
      assert.equal(sanitizeLocale(null, 'en'), 'en')
      assert.equal(sanitizeLocale(undefined, 'tr'), 'tr')
    })

    it('resolves initial locale from Accept-Language or browser language', () => {
      assert.equal(resolveInitialLocale('en-US,en;q=0.9,tr;q=0.8', null), 'en')
      assert.equal(resolveInitialLocale('tr-TR,tr;q=0.9', 'en-US'), 'tr')
      assert.equal(resolveInitialLocale(null, 'en-GB'), 'en')
      assert.equal(resolveInitialLocale('de-DE,fr;q=0.8', 'es-ES', 'tr'), 'tr')
    })
  })

  describe('sanitizeTheme', () => {
    it('allows only light and dark themes', () => {
      assert.equal(sanitizeTheme('dark'), 'dark')
      assert.equal(sanitizeTheme('LIGHT'), 'light')
      assert.equal(sanitizeTheme('invalid-theme', 'light'), 'light')
      assert.equal(sanitizeTheme(null, 'dark'), 'dark')
    })
  })

  describe('sanitizeBlockHeight', () => {
    it('clamps block heights within [1, MAX_SAFE_BLOCK_HEIGHT]', () => {
      assert.equal(sanitizeBlockHeight(1), 1)
      assert.equal(sanitizeBlockHeight(2200.9), 2200)
      assert.equal(sanitizeBlockHeight(0), 1)
      assert.equal(sanitizeBlockHeight(-500), 1)
      assert.equal(sanitizeBlockHeight(MAX_SAFE_BLOCK_HEIGHT + 99999), MAX_SAFE_BLOCK_HEIGHT)
      assert.equal(sanitizeBlockHeight(Number.NaN, 997), 997)
      assert.equal(sanitizeBlockHeight(Number.POSITIVE_INFINITY, 2200), 2200)
    })
  })

  describe('calculateNextMilestone', () => {
    it('computes Phase 1 milestone for blocks < 200', () => {
      const m = calculateNextMilestone(100, 'tr')
      assert.equal(m.target, 200)
      assert.equal(m.remaining, 100)
      assert.equal(m.progress, 50)
      assert.match(m.eraName, /Aşama 1/)
    })

    it('computes Phase 2 milestone for blocks 200..1999', () => {
      const m = calculateNextMilestone(1100, 'en')
      assert.equal(m.target, 2000)
      assert.equal(m.remaining, 900)
      assert.equal(m.progress, 50)
      assert.match(m.eraName, /Phase 2 Active/)
    })

    it('computes Phase 3 milestone for blocks 2000..2199', () => {
      const m = calculateNextMilestone(2100, 'en')
      assert.equal(m.target, 2200)
      assert.equal(m.remaining, 100)
      assert.equal(m.progress, 50)
      assert.match(m.eraName, /Phase 3 Active/)
    })

    it('computes Phase 4 milestone for blocks >= 2200 and clamps progress at 100%', () => {
      const m = calculateNextMilestone(15000, 'tr')
      assert.equal(m.target, 10000)
      assert.equal(m.remaining, 0)
      assert.equal(m.progress, 100)
      assert.match(m.eraName, /Aşama 4 Aktif/)
    })
  })

  describe('calculateTotalBlockReward & calculateEmissionEpochLabel', () => {
    it('returns 0 KRISTA at Genesis (block <= 1) for 0 premine enforcement', () => {
      assert.equal(calculateTotalBlockReward(1), 0)
      assert.equal(calculateTotalBlockReward(0), 0)
      assert.equal(calculateTotalBlockReward(-10), 0)
      assert.equal(calculateTotalBlockReward(Number.NaN), 0)
      assert.match(calculateEmissionEpochLabel(1, 'en'), /Genesis Block/)
    })

    it('returns 100 KRISTA during Bootstrap Era (blocks 2..9999)', () => {
      assert.equal(calculateTotalBlockReward(2), 100)
      assert.equal(calculateTotalBlockReward(500), 100)
      assert.equal(calculateTotalBlockReward(2200), 100)
      assert.equal(calculateTotalBlockReward(9999), 100)
      assert.match(calculateEmissionEpochLabel(500, 'tr'), /Erken Başlangıç/)
      assert.match(calculateEmissionEpochLabel(2200, 'en'), /Model D Bootstrap/)
    })

    it('returns 15 KRISTA at Standard Emission start (block 10000) and applies 1.9% quarterly geometric decay', () => {
      assert.equal(calculateTotalBlockReward(10000), 15)
      assert.equal(calculateTotalBlockReward(269199), 15)
      // Quarter 2 starts at 10000 + 259200 = 269200: 15 * 0.981 = 14.715
      assert.equal(calculateTotalBlockReward(269200), 14.715)
      assert.match(calculateEmissionEpochLabel(269200, 'en'), /Quarter #2/)
    })
  })

  describe('calculateModelDSplits & calculateRewardAmounts', () => {
    it('returns all zero splits at Genesis block 1', () => {
      const splits = calculateModelDSplits(1)
      assert.deepEqual(splits, {
        dev: 0,
        faucet: 0,
        mn: 0,
        quorum: 0,
        participants: 0,
        producer: 0
      })
    })

    it('allocates 7% dev, 0.7% faucet, and 92.3% producer before Model D activation (blocks 2..2199)', () => {
      const splits = calculateModelDSplits(500)
      assert.equal(splits.dev, 7.0)
      assert.equal(splits.faucet, 0.7)
      assert.equal(splits.producer, 92.3)
      assert.equal(splits.mn, 0)
      const sum = splits.dev + splits.faucet + splits.mn + splits.quorum + splits.participants + splits.producer
      assert.equal(parseFloat(sum.toFixed(4)), 100)
    })

    it('activates Model D 50/25/15/10 pool splits at block 2200 with faucet active', () => {
      const splits = calculateModelDSplits(2200)
      assert.equal(splits.dev, 7.0)
      assert.equal(splits.faucet, 0.7)
      // Remaining = 92.3%
      assert.equal(splits.mn, 46.15)
      assert.equal(splits.participants, 23.075)
      assert.equal(splits.producer, 13.845)
      assert.equal(splits.quorum, 9.23)
      const sum = splits.dev + splits.faucet + splits.mn + splits.quorum + splits.participants + splits.producer
      assert.equal(parseFloat(sum.toFixed(4)), 100)

      const amounts = calculateRewardAmounts(2200)
      assert.equal(amounts.total, 100)
      assert.equal(amounts.mn, 46.15)
      assert.equal(amounts.dev, 7.0)
    })

    it('terminates the 0.7% bootstrap faucet after block 50,000', () => {
      const at50k = calculateModelDSplits(50000)
      assert.equal(at50k.faucet, 0.7)

      const after50k = calculateModelDSplits(50001)
      assert.equal(after50k.faucet, 0.0)
      assert.equal(after50k.dev, 7.0)
      // Remaining = 93.0%
      assert.equal(after50k.mn, 46.5)
      assert.equal(after50k.participants, 23.25)
      assert.equal(after50k.producer, 13.95)
      assert.equal(after50k.quorum, 9.3)
      const sum =
        after50k.dev +
        after50k.faucet +
        after50k.mn +
        after50k.quorum +
        after50k.participants +
        after50k.producer
      assert.equal(parseFloat(sum.toFixed(4)), 100)
    })
  })

  describe('sanitizeMescalParams & generateMescalBytecode', () => {
    it('clamps out-of-range collateral and locktime values and strips injection characters', () => {
      const sanitized = sanitizeMescalParams({
        amount: -5000,
        locktime: 999999999,
        refundAddress: 'KTAddr123";\nOP_DRAIN_ALL<script>'
      })
      assert.equal(sanitized.amount, 1)
      assert.equal(sanitized.locktime, MAX_LOCKTIME_BLOCKS)
      assert.equal(sanitized.refundAddress, 'KTAddr123OP_DRAIN_ALLscript')
      assert.ok(!sanitized.refundAddress.includes('"'))
      assert.ok(!sanitized.refundAddress.includes('\n'))
    })

    it('generates deterministic bytecode for escrow, vesting, and token templates', () => {
      const escrowCode = generateMescalBytecode('escrow', {
        amount: MAX_SUPPLY_KRISTA + 500,
        locktime: 2880,
        refundAddress: 'KTNrvQkwv1Yo...CYv'
      })
      assert.match(escrowCode, /OP_INIT_CONTRACT "COIN_LOCK_MINER"/)
      assert.match(escrowCode, /OP_CHECK_COLLATERAL 210000000_KRISTA/)
      assert.match(escrowCode, /OP_PUSH_TIMEOUT 2880_BLOCKS/)

      const vestingCode = generateMescalBytecode('vesting')
      assert.match(vestingCode, /OP_INIT_CONTRACT "LINEAR_VESTING"/)

      const tokenCode = generateMescalBytecode('token')
      assert.match(tokenCode, /OP_INIT_CONTRACT "ASSET_TOKENIZATION"/)
    })
  })
})
