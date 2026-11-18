import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  isAppearancePreferences,
  loadPreferences,
  resolveTheme,
  savePreferences,
} from './preferences'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('appearance preferences', () => {
  it('loads valid saved preferences and rejects invalid values', () => {
    const getItem = vi.fn()
      .mockReturnValueOnce(JSON.stringify({ theme: 'system', textSize: 'large' }))
      .mockReturnValueOnce(JSON.stringify({ theme: 'sepia', textSize: 'huge' }))
    vi.stubGlobal('window', { localStorage: { getItem } })
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(loadPreferences()).toEqual({ theme: 'system', textSize: 'large' })
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
  })

  it('falls back safely when storage is unavailable', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(() => {
          throw new Error('blocked')
        }),
      },
    })
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES)
  })

  it('persists preferences and reports storage failures', () => {
    const setItem = vi.fn()
    vi.stubGlobal('window', { localStorage: { setItem } })
    expect(savePreferences({ theme: 'dark', textSize: 'small' })).toBe(true)
    expect(setItem).toHaveBeenCalledWith(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ theme: 'dark', textSize: 'small' }),
    )

    setItem.mockImplementationOnce(() => {
      throw new Error('quota exceeded')
    })
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(false)
  })

  it('resolves system theme from the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('validates only the supported options', () => {
    expect(isAppearancePreferences({ theme: 'light', textSize: 'medium' })).toBe(true)
    expect(isAppearancePreferences({ theme: 'forest', textSize: 'medium' })).toBe(true)
    expect(isAppearancePreferences({ theme: 'orange-black', textSize: 'large' })).toBe(true)
    expect(isAppearancePreferences({ theme: 'dark' })).toBe(false)
    expect(isAppearancePreferences({ theme: 'sepia', textSize: 'medium' })).toBe(false)
  })
})
