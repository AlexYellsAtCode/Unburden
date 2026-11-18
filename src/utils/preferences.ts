export const PREFERENCES_STORAGE_KEY = 'planaware_preferences'

export type AppearanceMode = 'light' | 'dark' | 'system'
export type ColorSet =
  | 'neutral'
  | 'forest'
  | 'orange'
  | 'ocean'
  | 'violet'
  | 'rose'
  | 'sand'
  | 'contrast'
export type TextSizePreference = 'small' | 'medium' | 'large'

export interface AppearancePreferences {
  mode: AppearanceMode
  colorSet: ColorSet
  textSize: TextSizePreference
}

export const DEFAULT_PREFERENCES: AppearancePreferences = {
  mode: 'light',
  colorSet: 'neutral',
  textSize: 'medium',
}

const modes = new Set<AppearanceMode>(['light', 'dark', 'system'])
const colorSets = new Set<ColorSet>([
  'neutral',
  'forest',
  'orange',
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
    modes.has(candidate.mode as AppearanceMode) &&
    colorSets.has(candidate.colorSet as ColorSet) &&
    textSizes.has(candidate.textSize as TextSizePreference)
  )
}

function migratePreferences(value: unknown): AppearancePreferences | null {
  if (isAppearancePreferences(value)) return value
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null

  const candidate = value as Record<string, unknown>
  if (!textSizes.has(candidate.textSize as TextSizePreference)) return null

  const legacyColorSets: Record<string, ColorSet> = {
    forest: 'forest',
    'orange-black': 'orange',
    ocean: 'ocean',
    violet: 'violet',
    rose: 'rose',
    sand: 'sand',
    contrast: 'contrast',
  }
  const legacyTheme = candidate.theme

  if (legacyTheme === 'light' || legacyTheme === 'dark' || legacyTheme === 'system') {
    return {
      mode: legacyTheme,
      colorSet: 'neutral',
      textSize: candidate.textSize as TextSizePreference,
    }
  }

  if (typeof legacyTheme === 'string' && legacyColorSets[legacyTheme]) {
    return {
      mode: legacyTheme === 'sand' ? 'light' : 'dark',
      colorSet: legacyColorSets[legacyTheme],
      textSize: candidate.textSize as TextSizePreference,
    }
  }

  return null
}

export function loadPreferences(): AppearancePreferences {
  try {
    if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES }

    const saved = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (saved === null) return { ...DEFAULT_PREFERENCES }

    const parsed: unknown = JSON.parse(saved)
    const migrated = migratePreferences(parsed)
    if (!migrated) {
      console.warn(`Ignoring invalid localStorage value for "${PREFERENCES_STORAGE_KEY}".`)
      return { ...DEFAULT_PREFERENCES }
    }

    return migrated
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
  preference: AppearanceMode,
  prefersDark = false,
): Exclude<AppearanceMode, 'system'> {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

export function applyPreferences(preferences: AppearancePreferences): void {
  if (typeof document === 'undefined') return

  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolvedMode = resolveTheme(preferences.mode, prefersDark)
  document.documentElement.dataset.theme =
    preferences.colorSet === 'neutral' ? resolvedMode : `${preferences.colorSet}-${resolvedMode}`
  document.documentElement.dataset.mode = resolvedMode
  document.documentElement.dataset.colorSet = preferences.colorSet
  document.documentElement.dataset.themePreference = preferences.mode
  document.documentElement.dataset.textSize = preferences.textSize
  document.documentElement.style.colorScheme = resolvedMode
}
