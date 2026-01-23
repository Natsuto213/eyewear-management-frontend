import React from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom' // Import cái này

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Bao bọc App lại */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)