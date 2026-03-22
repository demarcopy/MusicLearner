import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">🎶 MusicLearner</div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          📚 Mi Biblioteca
        </Link>
        <Link 
          to="/teoria" 
          className={location.pathname === '/teoria' ? 'active' : ''}
        >
          📖 Teoría Musical
        </Link>
        <Link 
          to="/practica" 
          className={location.pathname === '/practica' ? 'active' : ''}
        >
          🎸 Gimnasio (Práctica)
        </Link>
        <Link 
          to="/rutinas" 
          className={location.pathname === '/rutinas' ? 'active' : ''}
        >
          🏋️‍♀️ Rutinas (Cronómetro)
        </Link>
      </div>
    </nav>
  )
}
