import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isMobileEnvironment, isMobileViewport } from './deviceDetection'

function stubBrowser({
  standalone = false,
  displayMode = false,
  userAgent = 'Mozilla/5.0 (X11; Linux x86_64)',
  width = 1200,
}: {
  standalone?: boolean
  displayMode?: boolean
  userAgent?: string
  width?: number
} = {}) {
  vi.stubGlobal('window', {
    innerWidth: width,
    navigator: { standalone },
    matchMedia: vi.fn(() => ({ matches: displayMode })),
  })
  vi.stubGlobal('navigator', { userAgent })
}

beforeEach(() => {
  stubBrowser()
  vi.stubEnv('VITE_MOBILE_MODE', '')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('isMobileEnvironment', () => {
  it('detects installed apps', () => {
    stubBrowser({ standalone: true })

    expect(isMobileEnvironment()).toBe(true)
  })

  it('detects standalone display modes', () => {
    stubBrowser({ displayMode: true })

    expect(isMobileEnvironment()).toBe(true)
  })

  it('detects mobile user agents', () => {
    stubBrowser({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)' })

    expect(isMobileEnvironment()).toBe(true)
  })

  it('detects mobile viewport widths', () => {
    stubBrowser({ width: 767 })

    expect(isMobileEnvironment()).toBe(true)
    expect(isMobileViewport()).toBe(true)
  })

  it('returns false for a desktop browser', () => {
    expect(isMobileEnvironment()).toBe(false)
    expect(isMobileViewport()).toBe(false)
  })

  it('honors the explicit mobile-mode override', () => {
    vi.stubEnv('VITE_MOBILE_MODE', 'true')

    expect(isMobileEnvironment()).toBe(true)

    stubBrowser({ standalone: true })
    vi.stubEnv('VITE_MOBILE_MODE', 'false')

    expect(isMobileEnvironment()).toBe(false)
  })
})
