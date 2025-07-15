
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ParticleBackground from './components/ParticleBackground';
import Preloader from './components/Preloader.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Preloader />
      <ParticleBackground />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
