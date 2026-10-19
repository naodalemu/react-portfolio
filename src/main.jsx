import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Scroll reveals only switch on when they can actually run and the visitor
// hasn't asked for reduced motion; otherwise everything renders in place.
const canAnimate =
  'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (canAnimate) document.documentElement.classList.add('js-motion')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
