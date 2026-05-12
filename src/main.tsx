import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setupAxiosInterceptors } from './utils/auth'

// Initialize axios interceptors for automatic token handling
setupAxiosInterceptors()

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


