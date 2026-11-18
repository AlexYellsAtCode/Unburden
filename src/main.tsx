import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { applyPreferences, loadPreferences } from './utils/preferences'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element was not found')

applyPreferences(loadPreferences())

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)