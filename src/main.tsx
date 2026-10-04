import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

if (typeof window !== 'undefined' && window.location.hostname === 'face.qa') {
  window.location.replace(`https://www.face.qa${window.location.pathname}${window.location.search}${window.location.hash}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
