export const PREFERENCES_STORAGE_KEY = 'planaware_preferences'

export type ThemePreference =
  | 'light'
  | 'dark'
  | 'system'
  | 'forest'
  | 'orange-black'
  | 'ocean'
  | 'violet'
  | 'rose'
  | 'sand'
  | 'contrast'
export type TextSizePreference = 'small' | 'medium' | 'large'

export interface AppearancePreferences {
  theme: ThemePreference
  textSize: TextSizePreference
}

export const DEFAULT_PREFERENCES: AppearancePreferences = {
  theme: 'light',
  textSize: 'medium',
}

const themes = new Set<ThemePreference>([
  'light',
  'dark',
  'system',
  'forest',
  'orange-black',
  'ocean',
  'violet',
  'rose',
  'sand',
  'contrast',
])
const textSizes = new Set<TextSizePreference>(['small', 'medium', 'large'])

export function isAppearancePreferences(value: unknown): value is AppearancePreferences {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const candidate = value as Record<string, unknown>
  return (
    themes.has(candidate.theme as ThemePreference) &&
    textSizes.has(candidate.textSize as TextSizePreference)
  )
}

export function loadPreferences(): AppearancePreferences {
  try {
    if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES }

    const saved = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (saved === null) return { ...DEFAULT_PREFERENCES }

    const parsed: unknown = JSON.parse(saved)
    if (!isAppearancePreferences(parsed)) {
      console.warn(`Ignoring invalid localStorage value for "${PREFERENCES_STORAGE_KEY}".`)
      return { ...DEFAULT_PREFERENCES }
    }

    return parsed
  } catch (error) {
    console.warn(`Unable to load localStorage value for "${PREFERENCES_STORAGE_KEY}".`, error)
    return { ...DEFAULT_PREFERENCES }
  }
}

export function savePreferences(preferences: AppearancePreferences): boolean {
  try {
    if (typeof window === 'undefined') return false
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
    return true
  } catch (error) {
    console.warn(`Unable to save localStorage value for "${PREFERENCES_STORAGE_KEY}".`, error)
    return false
  }
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark = false,
): ThemePreference {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

export function applyPreferences(preferences: AppearancePreferences): void {
  if (typeof document === 'undefined') return

  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolvedTheme = resolveTheme(preferences.theme, prefersDark)
  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.dataset.themePreference = preferences.theme
  document.documentElement.dataset.textSize = preferences.textSize
  document.documentElement.style.colorScheme =
    resolvedTheme === 'light' || resolvedTheme === 'sand' ? 'light' : 'dark'
}
