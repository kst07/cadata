import React  from 'react'
import ReactDom  from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDom.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </Router>
)
