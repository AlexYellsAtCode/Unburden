import { StatusBar } from './StatusBar'
import type { ReactNode } from 'react'

interface PhoneFrameWrapperProps {
  children: ReactNode
  currentTime: Date
  isMobileMode: boolean
}

export function PhoneFrameWrapper({ children, currentTime, isMobileMode }: PhoneFrameWrapperProps) {
  if (isMobileMode) {
    // On actual mobile devices, show app full-screen without phone frame
    return <div className="mobile-app-shell">{children}</div>
  }

  // On desktop/web, show phone mockup frame
  return (
    <main className="page-shell">
      <div className="phone-frame">
        <StatusBar currentTime={currentTime} />
        <section className="app-card">{children}</section>
      </div>
    </main>
  )
}
