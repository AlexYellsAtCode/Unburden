import { useEffect, useRef } from 'react'
import type {
  AppearanceMode,
  AppearancePreferences,
  ColorSet,
  TextSizePreference,
} from '../utils/preferences'

interface SettingsMenuProps {
  preferences: AppearancePreferences
  onChange: (preferences: AppearancePreferences) => void
  onClose: () => void
}

const modeOptions: { value: AppearanceMode; label: string; detail: string }[] = [
  { value: 'system', label: 'System', detail: 'Follow your device' },
  { value: 'light', label: 'Light', detail: 'Bright and clear' },
  { value: 'dark', label: 'Dark', detail: 'Easy on the eyes' },
]

const colorOptions: { value: ColorSet; label: string; detail: string }[] = [
  { value: 'neutral', label: 'Neutral', detail: 'Classic blue-gray' },
  { value: 'forest', label: 'Forest', detail: 'Green and fresh' },
  { value: 'orange', label: 'Sunset', detail: 'Warm and bold' },
  { value: 'ocean', label: 'Ocean', detail: 'Cool and focused' },
  { value: 'violet', label: 'Violet', detail: 'Calm and creative' },
  { value: 'rose', label: 'Rose', detail: 'Soft and energetic' },
  { value: 'sand', label: 'Warm sand', detail: 'Warm and relaxed' },
  { value: 'coffee', label: 'Coffee', detail: 'Rich and comforting' },
  { value: 'monochrome', label: 'Monochrome', detail: 'Clean and understated' },
  { value: 'slate', label: 'Slate', detail: 'Cool and composed' },
  { value: 'contrast', label: 'High contrast', detail: 'Maximum clarity' },
]

const textSizeOptions: { value: TextSizePreference; label: string; sample: string }[] = [
  { value: 'small', label: 'Small', sample: 'Aa' },
  { value: 'medium', label: 'Medium', sample: 'Aa' },
  { value: 'large', label: 'Large', sample: 'Aa' },
]

export function SettingsMenu({ preferences, onChange, onClose }: SettingsMenuProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  function selectMode(mode: AppearanceMode) {
    onChange({ ...preferences, mode })
  }

  function selectColorSet(colorSet: ColorSet) {
    onChange({ ...preferences, colorSet })
  }

  function selectTextSize(textSize: TextSizePreference) {
    onChange({ ...preferences, textSize })
  }

  return (
    <div className="settings-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div
        ref={dialogRef}
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="settings-header">
          <div>
            <p className="eyebrow">Personalize Unburden</p>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="settings-close"
            aria-label="Close settings"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <fieldset className="settings-fieldset">
          <legend>Light/Dark Mode</legend>
          <p className="settings-help">Choose a light or dark appearance, or follow your device.</p>
          <div className="mode-options" aria-label="Light/dark mode">
            {modeOptions.map((option) => (
              <label key={option.value} className={`mode-option mode-${option.value}`}>
                <input
                  type="radio"
                  name="appearance-mode"
                  value={option.value}
                  checked={preferences.mode === option.value}
                  onChange={() => selectMode(option.value)}
                />
                <span className="theme-option-copy">
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="settings-fieldset">
          <legend>Palette</legend>
          <p className="settings-help">Each palette supports both light and dark modes.</p>
          <div className="theme-options color-options">
            {colorOptions.map((option) => (
              <label key={option.value} className={`theme-option theme-${option.value}`}>
                <input
                  type="radio"
                  name="color-set"
                  value={option.value}
                  checked={preferences.colorSet === option.value}
                  onChange={() => selectColorSet(option.value)}
                />
                <span className="theme-swatch" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <span className="theme-option-copy">
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="settings-fieldset">
          <legend>Text size</legend>
          <p className="settings-help">Make task titles, labels, and controls more comfortable to read.</p>
          <div className="text-size-options">
            {textSizeOptions.map((option) => (
              <label key={option.value} className={`text-size-option size-${option.value}`}>
                <input
                  type="radio"
                  name="text-size"
                  value={option.value}
                  checked={preferences.textSize === option.value}
                  onChange={() => selectTextSize(option.value)}
                />
                <span className="text-size-sample" aria-hidden="true">{option.sample}</span>
                <strong>{option.label}</strong>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={`settings-preview preview-${preferences.textSize}`} aria-label="Settings preview">
          <p className="settings-preview-label">Live preview</p>
          <div className="settings-preview-card">
            <span className="settings-preview-dot" aria-hidden="true" />
            <div>
              <strong>Plan an important task</strong>
              <p>Today at 2:30 PM</p>
            </div>
            <span className="settings-preview-badge">30 min</span>
          </div>
        </div>

        <button type="button" className="settings-done" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}
