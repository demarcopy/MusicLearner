import { useState, useEffect } from 'react'
import { Chord } from '@tonaljs/tonal'
import ChordDiagram from '../components/ChordDiagram'

let audioCtx = null;
const playClick = (isAccent = false) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, audioCtx.currentTime); // Woodblock-ish sound
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); // Short tick
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    console.log('AudioContext not supported or active yet');
  }
}

// -- DICCIONARIOS DE NUESTROS "4 MODOS DEPORTIVOS" --
const simpleChordsList = ['C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm']
const powerChordsList  = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5']
const spiderList       = ['🕷️ 1-2-3-4', '🕷️ 1-3-2-4', '🕷️ 1-4-3-2', '🕷️ 1-2-4-3', '🕷️ 4-3-2-1', '🕷️ 4-2-3-1', '🕷️ 2-1-3-4', '🕷️ 3-1-2-4']
const pentaList        = ['🎸 Caja 1 (Raíz)', '🎸 Caja 2', '🎸 Caja 3', '🎸 Caja 4', '🎸 Caja 5']

// Menú de navegación de nuestro Game Engine
const modes = [
  { id: 'CHORDS', title: 'Acordes Clásicos' },
  { id: 'POWER_CHORDS', title: 'Power Chords' },
  { id: 'SPIDER', title: 'Ejercicios de Araña' },
  { id: 'PENTATONIC', title: 'Cajas Pentatónicas' }
]

const enToEs = {
  'C': 'Do Mayor', 'Cm': 'Do menor', 'C5': 'Do Quinta (Power)',
  'D': 'Re Mayor', 'Dm': 'Re menor', 'D5': 'Re Quinta (Power)',
  'E': 'Mi Mayor', 'Em': 'Mi menor', 'E5': 'Mi Quinta (Power)',
  'F': 'Fa Mayor', 'Fm': 'Fa menor', 'F5': 'Fa Quinta (Power)',
  'G': 'Sol Mayor', 'Gm': 'Sol menor', 'G5': 'Sol Quinta (Power)',
  'A': 'La Mayor', 'Am': 'La menor', 'A5': 'La Quinta (Power)',
  'B': 'Si Mayor', 'Bm': 'Si menor', 'B5': 'Si Quinta (Power)'
}

export default function Practice() {
  // Qué disciplina está practicando hoy el usuario
  const [practiceMode, setPracticeMode] = useState('CHORDS')
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [rpm, setRpm] = useState(60)
  
  // -- CONFIGURADORES VISUALES --
  const [selectedChords, setSelectedChords] = useState(simpleChordsList)
  const [showHints, setShowHints] = useState(true)
  const [showNext, setShowNext] = useState(true)
  const [showDiagram, setShowDiagram] = useState(true)
  
  const [currentItem, setCurrentItem] = useState('-')
  const [nextItem, setNextItem] = useState('-')
  const [tick, setTick] = useState(0)

  // 1. Reloj Maestro ininterrumpido
  useEffect(() => {
    let timer;
    if(isPlaying) {
      playClick(true); // Primer metrónomo al dar play (acento)
      timer = setInterval(() => {
         setTick(t => {
           const nextTick = t + 1;
           playClick(nextTick % 4 === 0);
           return nextTick;
         })
      }, (60 / rpm) * 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, rpm])

  // 2. Ciclo de Vida: Qué hacer cada vez que la manecilla de reloj camina (+1s)
  useEffect(() => {
    if (isPlaying) {
      if (tick === 0) {
        const first = getRandomItem(null)
        const second = getRandomItem(first)
        setCurrentItem(first)
        setNextItem(second)
      } else if (tick % 4 === 0) {
        setCurrentItem(nextItem)
        setNextItem(getRandomItem(nextItem))
      }
    }
  }, [tick, isPlaying])

  // Resetear contadores si cabiamos violentamente de disciplina
  const handleModeChange = (modeId) => {
     setPracticeMode(modeId)
     setIsPlaying(false)
     setTick(0)
     setCurrentItem('-')
     setNextItem('-')
  }

  // Toma una base de datos diferente al azar dependiendo del modo seleccionado en el Navbar superior
  const getRandomItem = (exclude) => {
    let pool = []
    if (practiceMode === 'CHORDS') pool = selectedChords
    else if (practiceMode === 'POWER_CHORDS') pool = powerChordsList
    else if (practiceMode === 'SPIDER') pool = spiderList
    else if (practiceMode === 'PENTATONIC') pool = pentaList

    // Seguridad por si eliminaron todos los checkboxes menos 1
    if (pool.length === 1) return pool[0]
    
    let item = exclude
    while(item === exclude) {
      item = pool[Math.floor(Math.random() * pool.length)]
    }
    return item
  }

  const togglePlay = () => {
    if(isPlaying) {
      setIsPlaying(false)
      setTick(0)
      setCurrentItem('-')
      setNextItem('-')
    } else {
      setIsPlaying(true)
    }
  }

  // Para el grid de Acordes
  const handleToggleChord = (c) => {
    if (selectedChords.includes(c)) {
      if (selectedChords.length <= 2) {
        alert("¡Cuidado! Debes dejar activos al menos 2 acordes.")
        return
      }
      setSelectedChords(selectedChords.filter(x => x !== c))
    } else {
      setSelectedChords([...selectedChords, c])
    }
  }

  return (
    <div className="practice-container">
      <div className="theory-header" style={{paddingBottom:'0px'}}>
        <h2 style={{fontSize: '3rem', marginBottom: '10px'}}>🎸 Gimnasio Multidisciplinario</h2>
        <p className="helper-text" style={{fontSize: '1.2rem', color: '#b3b3b3'}}>No limites tu entrenamiento solo a los acordes. Selecciona una disciplina de la barra para practicar arpegios, escalas, arañas o ritmos.</p>
      </div>

      {/* SELECTOR DE MODO DE JUEGO */}
      <div style={{display:'flex', justifyContent:'center', gap:'15px', marginTop:'20px', flexWrap:'wrap'}}>
        {modes.map(mode => (
          <button 
             key={mode.id}
             onClick={() => handleModeChange(mode.id)}
             style={{
               padding:'15px 30px', borderRadius:'30px', fontSize:'1.1rem', fontWeight:'bold', border:'2px solid transparent', cursor:'pointer', transition:'all 0.2s',
               backgroundColor: practiceMode === mode.id ? 'var(--primary-color)' : '#1a1a1a',
               color: practiceMode === mode.id ? 'black' : '#888',
               borderColor: practiceMode === mode.id ? 'transparent' : '#333'
             }}
          >
             {mode.title}
          </button>
        ))}
      </div>

      <div className="practice-dashboard">
        
        {/* Panel Izquierdo de Relojería y Settings */}
        <div className="practice-settings-panel">
          
          <div className="practice-controls">
            <div className="control-group">
              <label>Impulsos de Metrónomo:</label>
              <div className="speed-selector" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <button disabled={isPlaying} onClick={() => setRpm(Math.max(1, rpm - 1))}>-</button>
                
                <div style={{display: 'flex', alignItems: 'center', background: '#333', borderRadius: '8px', padding: '5px 10px'}}>
                  <input 
                    type="number" 
                    disabled={isPlaying} 
                    value={rpm} 
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(1, Number(e.target.value));
                      setRpm(val);
                    }}
                    onBlur={(e) => {
                      if(e.target.value === '' || Number(e.target.value) < 1) setRpm(60);
                    }}
                    style={{
                      width: '60px', 
                      textAlign: 'center', 
                      fontSize: '1.2rem', 
                      backgroundColor: 'transparent', 
                      color: 'white', 
                      border: 'none', 
                      outline: 'none',
                      fontWeight: 'bold'
                    }}
                  />
                  <span style={{color: '#888', marginLeft: '5px', fontWeight: 'bold'}}>RPM</span>
                </div>

                <button disabled={isPlaying} onClick={() => setRpm(rpm === '' ? 2 : rpm + 1)}>+</button>
              </div>
            </div>
            <button 
              className={`play-btn master-play ${isPlaying ? 'stop' : ''}`} 
              onClick={togglePlay}
            >
              {isPlaying ? '⏹ Detener Reloj' : '▶️ Iniciar'}
            </button>
          </div>

          <div className="advanced-settings">
            <h3>⚙️ Parámetros de Disciplina</h3>
            
            {/* Solo aplicable en modo clásico */}
            {practiceMode === 'CHORDS' && (
              <>
                <h4 style={{color:'#1DB954', marginTop:'20px'}}>Acordes Permitidos:</h4>
                <div className="chords-grid">
                  {simpleChordsList.map(chord => (
                    <label key={chord} className={`chord-checkbox ${selectedChords.includes(chord) ? 'active' : ''}`}>
                      <input type="checkbox" checked={selectedChords.includes(chord)} onChange={() => handleToggleChord(chord)} disabled={isPlaying} style={{display:'none'}}/>
                      {chord}
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Dificultades dinámicas según disciplina */}
            {(practiceMode === 'CHORDS' || practiceMode === 'POWER_CHORDS') && (
              <>
                <h4 style={{color:'#1DB954', marginTop:'20px'}}>Filtros de Visión:</h4>
                <div className="checkboxes-toggles">
                  <label><input type="checkbox" checked={showDiagram} onChange={e => setShowDiagram(e.target.checked)} disabled={isPlaying}/> Dibujar Tablatura del Mástil</label>
                  <label><input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} disabled={isPlaying}/> Pistas Numéricas Tonal.js</label>
                  <label><input type="checkbox" checked={showNext} onChange={e => setShowNext(e.target.checked)} disabled={isPlaying}/> Ojo Anticipador de "Siguiente"</label>
                </div>
              </>
            )}
            
            {(practiceMode === 'SPIDER' || practiceMode === 'PENTATONIC') && (
              <>
                <h4 style={{color:'#1DB954', marginTop:'20px'}}>Filtros de Visión:</h4>
                <div className="checkboxes-toggles">
                  <label><input type="checkbox" checked={showNext} onChange={e => setShowNext(e.target.checked)} disabled={isPlaying}/> Ojo Anticipador de Pantalla</label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Panel Derecho: Visor de Juego Óptico */}
        <div className={`chord-screen ${isPlaying ? 'active-screen' : ''}`}>
          
          <div className="main-chord">
            <h3>{practiceMode === 'SPIDER' ? 'Ejecuta esta Araña' : practiceMode === 'PENTATONIC' ? 'Fase sobre esta Escala' : 'Acorde Central Obligatorio'}</h3>
            
            {/* Si es araña, la letra es más larga. Si está en espera, usamos fuente acorde al mensaje */}
            <div className="chord-huge" style={{
               fontSize: currentItem === '-' ? '3.5rem' : (practiceMode === 'SPIDER' ? '4.5rem' : '7rem'), 
               whiteSpace: 'normal',
               wordBreak: 'break-word'
            }}>
               {currentItem !== '-' ? currentItem : 'Aguardando...'}
            </div>
            
            <div className="chord-english">
               {(practiceMode === 'CHORDS' || practiceMode === 'POWER_CHORDS') && currentItem !== '-' ? enToEs[currentItem] : ''}
            </div>
            
            {/* Solo dibujar SVG para acordes conocidos */}
            {showDiagram && currentItem !== '-' && (practiceMode === 'CHORDS' || practiceMode === 'POWER_CHORDS') && (
              <ChordDiagram chordName={currentItem} />
            )}
            
            {/* Tonal JS Tips */}
            {showHints && currentItem !== '-' && (practiceMode === 'CHORDS' || practiceMode === 'POWER_CHORDS') && (
              <div className="chord-notes-hint">
                <strong style={{color:"#444"}}>{practiceMode === 'POWER_CHORDS' ? 'Cuerdas a apretar:' : 'Notas de piano:'} </strong> 
                {Chord.get(currentItem).notes.join(' - ')}
              </div>
            )}
          </div>

          {/* Cola de Memoria */}
          {showNext && (
            <div className="next-chord">
              <h4>A continuación...</h4>
              <div className="chord-medium">{nextItem !== '-' ? nextItem : '-'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
