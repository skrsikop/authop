import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </CookiesProvider>
  ,
)
