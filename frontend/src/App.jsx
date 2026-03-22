import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Library from './pages/Library'
import Theory from './pages/Theory'
import Practice from './pages/Practice'
import Routines from './pages/Routines'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-main-layout">
        <Navbar />
        <div className="pages-container">
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/teoria" element={<Theory />} />
            <Route path="/practica" element={<Practice />} />
            <Route path="/rutinas" element={<Routines />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
