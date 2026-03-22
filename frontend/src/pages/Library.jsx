import { useState, useEffect } from 'react'

export default function Library() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Buscar en Songsterr API pública
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  // 1. CARGA DESDE EL NAVEGADOR
  const fetchMyLibrary = () => {
    const saved = localStorage.getItem("misCanciones")
    if (saved) {
      try {
        setSongs(JSON.parse(saved))
      } catch (e) {
        setSongs([])
      }
    } else {
      setSongs([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMyLibrary()
  }, [])

  // 2. BÚSQUEDA CORS-FREE (Serverless Proxy Universal)
  const handleSearchSongsterr = (e) => {
    e.preventDefault()
    if(!searchQuery) return
    
    setIsSearching(true)
    setSearchError('')
    setSearchResults([]) 
    
    // Usamos el puente público AllOrigins para brincar el bloqueo CORS del navegador sin necesidad de Vercel Functions
    const songsterrUrl = `http://www.songsterr.com/a/ra/songs.json?pattern=${encodeURIComponent(searchQuery)}`
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(songsterrUrl)}`

    fetch(proxyUrl)
      .then(res => {
        if (!res.ok) throw new Error("El puente AllOrigins / Songsterr no respondió")
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
           setSearchResults(data.slice(0, 10))
        } else {
           setSearchError("No se encontraron tablaturas con ese nombre. Prueba con algo más corto o solo el artista.")
        }
        setIsSearching(false)
      })
      .catch(err => {
        console.error("Error buscando en Songsterr: ", err)
        setSearchError("Hubo un error contactando al puente libre o a la base mundial de Songsterr.")
        setIsSearching(false)
      })
  }

  const handleSaveFromApi = (apiSong) => {
    const newSong = { 
      id: Date.now().toString(),
      title: apiSong.title, 
      artist: apiSong.artist.name, // La API directa devuelve un objeto {artist: {name: 'Pink Floyd'}}
      content: "", 
      songsterrId: apiSong.id // La API directa devuelve 'id'
    }
    
    const updated = [...songs, newSong]
    setSongs(updated)
    localStorage.setItem("misCanciones", JSON.stringify(updated))
    
    setSearchResults([]) 
    setSearchQuery('')
  }

  const handleDelete = (id) => {
    if(window.confirm('¿Seguro quieres borrar esta canción de tu biblioteca personal?')) {
      const updated = songs.filter(s => s.id !== id)
      setSongs(updated)
      localStorage.setItem("misCanciones", JSON.stringify(updated))
    }
  }

  return (
    <div className="library-page">
      {/* BUSCADOR EXTERNO */}
      <div className="form-card">
        <h2>🔍 Buscar Canción o Artista</h2>
        <p className="helper-text">Hacemos magia conectándonos a la extensa base mundial de Songsterr por medio de Nodos Serverless.</p>
        <form onSubmit={handleSearchSongsterr} className="search-form">
          <input 
            type="text" 
            placeholder="Ej: Pink Floyd, Metallica, The Beatles..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? "Buscando en la Nube..." : "Buscar Tablatura"}
          </button>
        </form>

        {searchError && <p className="error" style={{textAlign: "center", marginTop: "15px"}}>{searchError}</p>}

        {searchResults.length > 0 && (
          <div className="results-list">
            {searchResults.map(apiSong => (
              <div key={apiSong.id} className="result-item">
                <div className="result-info">
                  <strong>{apiSong.title}</strong>
                  <span>🎤 {apiSong.artist.name}</span>
                </div>
                <button onClick={() => handleSaveFromApi(apiSong)} className="add-btn">
                  + A mi Biblioteca
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BIBLIOTECA DEL USUARIO */}
      <div className="songs-container">
        <h2>📚 Mi Biblioteca Guardada (Memoria de Navegador)</h2>
        {loading ? <p>Cargando tus canciones...</p> : null}
        {(!loading && songs.length === 0) ? <p style={{color:'#888'}}>No tienes tablaturas guardadas. ¡Busca una arriba!</p> : null}
        
        <div className="songs-grid">
          {songs.map(song => (
            <div key={song.id} className="song-card">
              <div className="card-header">
                <div>
                  <h3>{song.title}</h3>
                  <p className="artist">🎸 {song.artist}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(song.id)} title="Borrar de la Memoria">✕</button>
              </div>
              
              <div className="song-content">
                {song.songsterrId ? (
                  <div className="songsterr-link-container">
                    <p>✅ Enlazada correctamente a la API.</p>
                    <a 
                      href={`https://www.songsterr.com/a/wa/song?id=${song.songsterrId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="play-btn"
                    >
                      ▶️ Abrir Tablatura Oficial
                    </a>
                  </div>
                ) : (
                  <pre>{song.content || "Sin acordes agregados"}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
