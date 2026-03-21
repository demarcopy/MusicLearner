import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Cargando backend...')

  useEffect(() => {
    // Vite usa localhost:5173, Spring Boot usa localhost:8080 por defecto
    fetch('http://localhost:8080/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error conectando al backend: ' + err.message + ' (Asegúrate de tener Spring Boot encendido)'))
  }, [])

  return (
    <div className="app-container">
      <header>
        <h1>🎶 MusicLearner</h1>
        <p className="subtitle">Tu biblioteca musical interactiva</p>
      </header>
      <main>
        <div className="status-card">
          <h2>Estado del Servidor:</h2>
          <p className={message.includes('Error') ? 'error' : 'success'}>
            {message}
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
