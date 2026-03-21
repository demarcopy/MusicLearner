import { useState, useEffect } from 'react'

export default function Library() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Buscar en Songsterr API pública
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const fetchMyLibrary = () => {
    fetch('http://localhost:8080/api/songs')
      .then(res => res.json())
      .then(data => {
        setSongs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error al conectarse con Java:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMyLibrary()
  }, [])

  const handleSearchSongsterr = (e) => {
    e.preventDefault()
    if(!searchQuery) return
    
    setIsSearching(true)
    setSearchError('')
    setSearchResults([]) 
    
    const urlSeguraParaLaWeb = encodeURIComponent(searchQuery)

    // PROXY hacia Java
    fetch(`http://localhost:8080/api/songsterr/search?pattern=${urlSeguraParaLaWeb}`)
      .then(res => {
        if (!res.ok) throw new Error("La API interna en Java no respondió correctamente")
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
        setSearchError("Hubo un error contactando al proxy de Java o a la base mundial de Songsterr.")
        setIsSearching(false)
      })
  }

  const handleSaveFromApi = (apiSong) => {
    const newSong = { 
      title: apiSong.title, 
      artist: apiSong.artist, 
      content: "", 
      songsterrId: apiSong.songId 
    }
    
    fetch('http://localhost:8080/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSong)
    })
    .then(() => {
      fetchMyLibrary()
      setSearchResults([]) 
      setSearchQuery('')
    })
  }

  const handleDelete = (id) => {
    if(window.confirm('¿Seguro quieres borrar esta canción de tu biblioteca?')) {
      fetch(`http://localhost:8080/api/songs/${id}`, { method: 'DELETE' })
      .then(() => fetchMyLibrary())
    }
  }

  return (
    <div className="library-page">
      {/* BUSCADOR EXTERNO */}
      <div className="form-card">
        <h2>🔍 Buscar Canción o Artista</h2>
        <p className="helper-text">Hacemos magia conectándonos a la extensa base de datos mundial de Songsterr a través de Java.</p>
        <form onSubmit={handleSearchSongsterr} className="search-form">
          <input 
            type="text" 
            placeholder="Ej: Pink Floyd, Metallica, The Beatles..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? "Buscando..." : "Buscar Tablatura"}
          </button>
        </form>

        {searchError && <p className="error" style={{textAlign: "center", marginTop: "15px"}}>{searchError}</p>}

        {searchResults.length > 0 && (
          <div className="results-list">
            {searchResults.map(apiSong => (
              <div key={apiSong.songId} className="result-item">
                <div className="result-info">
                  <strong>{apiSong.title}</strong>
                  <span>🎤 {apiSong.artist}</span>
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
        <h2>📚 Mi Biblioteca Guardada</h2>
        {loading ? <p>Cargando tus canciones...</p> : null}
        {(!loading && songs.length === 0) ? <p>No tienes tablaturas guardadas. ¡Busca una arriba!</p> : null}
        
        <div className="songs-grid">
          {songs.map(song => (
            <div key={song.id} className="song-card">
              <div className="card-header">
                <div>
                  <h3>{song.title}</h3>
                  <p className="artist">🎸 {song.artist}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(song.id)}>✕</button>
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
