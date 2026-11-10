import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PhoneFrameWrapper } from './components/PhoneFrameWrapper'
import { isMobileEnvironment } from './utils/deviceDetection'
import './styles.css'

function AppWithPhoneFrame() {
  const [currentTime, setCurrentTime] = React.useState(() => new Date())
  const isMobileMode = isMobileEnvironment()

  React.useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <PhoneFrameWrapper currentTime={currentTime} isMobileMode={isMobileMode}>
      <App />
    </PhoneFrameWrapper>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element was not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppWithPhoneFrame />
  </React.StrictMode>,
)
