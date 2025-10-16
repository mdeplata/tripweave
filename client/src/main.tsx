import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { testUtil } from '@utils/test'
import './index.css'
import App from './App.tsx'

testUtil();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
