import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { translations, translate } from '../app/composables/useI18n.ts'

describe('Internationalization & Translation Security (app/composables/useI18n.ts)', () => {
  it('maintains 100% key parity between English (en) and Turkish (tr) dictionaries', () => {
    const enKeys = Object.keys(translations.en).sort()
    const trKeys = Object.keys(translations.tr).sort()
    assert.deepEqual(trKeys, enKeys, 'Turkish and English translation keys must match exactly')
    assert.ok(enKeys.length >= 65, 'Expected comprehensive dictionary coverage')
  })

  it('ensures every translation entry in both locales is a non-empty string', () => {
    for (const [key, value] of Object.entries(translations.en)) {
      assert.equal(typeof value, 'string', `en.${key} must be a string`)
      assert.ok(value.trim().length > 0, `en.${key} must not be empty`)
    }
    for (const [key, value] of Object.entries(translations.tr)) {
      assert.equal(typeof value, 'string', `tr.${key} must be a string`)
      assert.ok(value.trim().length > 0, `tr.${key} must not be empty`)
    }
  })

  it('translates known keys accurately and falls back safely on unknown keys', () => {
    assert.equal(translate('tr', 'brandName'), 'KRISTA')
    assert.equal(translate('en', 'brandName'), 'KRISTA')
    assert.equal(translate('tr', 'explorer'), 'Blok Gezgini')
    assert.equal(translate('en', 'explorer'), 'Block Explorer')
    assert.equal(translate('tr', 'nonExistentKey_123'), 'nonExistentKey_123')
    assert.equal(translate('tr', ''), '')
  })

  it('blocks Object.prototype property lookup (__proto__, constructor, toString)', () => {
    assert.equal(translate('tr', '__proto__'), '__proto__')
    assert.equal(translate('en', 'constructor'), 'constructor')
    assert.equal(translate('tr', 'toString'), 'toString')
    assert.equal(translate('__proto__', 'brandName'), 'KRISTA')
  })
})
