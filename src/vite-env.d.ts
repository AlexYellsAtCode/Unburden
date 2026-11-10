/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_SEED_DATA?: string
  readonly VITE_MOBILE_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Navigator {
  readonly standalone?: boolean
}

interface Window {
  testDeviceDetection?: () => void
}
