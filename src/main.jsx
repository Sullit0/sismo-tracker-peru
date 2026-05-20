import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// =============================================================================
// PASO 1 — Ciclo de render + React.StrictMode
// =============================================================================
// <StrictMode> dobla en desarrollo: cada componente se monta, se desmonta y
// se vuelve a montar para forzar a detectar efectos no idempotentes. Por eso
// los useEffect que disparan fetch necesitan AbortController (Paso 2).
// En producción StrictMode no tiene costo: se compila como un fragmento.
// =============================================================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
