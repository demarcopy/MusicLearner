import { useState, useEffect, useRef } from 'react'

const defaultRoutines = [
  {
    id: 'd1',
    name: "Rutina del Principiante Rockstar",
    type: "DEFAULT",
    exercises: [
      { name: "🕷️ Ejercicios de Araña (Calentamiento)", durationMinutes: 5 },
      { name: "🎸 Práctica de Power Chords en Gimnasio", durationMinutes: 10 },
      { name: "🎵 Tocar tu Canción Favorita sin detenerte", durationMinutes: 15 }
    ]
  },
  {
    id: 'd2',
    name: "Técnica de Solos y Escalas",
    type: "DEFAULT",
    exercises: [
      { name: "🖐️ Estiramiento de Dedos (Lento)", durationMinutes: 3 },
      { name: "🎼 Escala Pentatónica Arriba y Abajo con Metrónomo", durationMinutes: 10 },
      { name: "🔥 Improvisación (Soloing Backing Track)", durationMinutes: 15 }
    ]
  }
]

export default function Routines() {
  const [view, setView] = useState('DASHBOARD') 
  
  const [dbRoutines, setDbRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  
  // -- ESTADOS DEL CONSTRUCTOR (BUILDER) --
  const [newRoutineName, setNewRoutineName] = useState('')
  const [newExercises, setNewExercises] = useState([])
  const [currentExName, setCurrentExName] = useState('')
  const [currentExDuration, setCurrentExDuration] = useState(5)

  // -- ESTADOS DEL REPRODUCTOR (PLAYER) --
  const [activeRoutine, setActiveRoutine] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  // 1. CARGA DESDE LA MEMORIA DEL NAVEGADOR (Pura magia Frontend)
  const fetchRoutines = () => {
    const saved = localStorage.getItem("misRutinasMusicales")
    if (saved) {
      try {
        setDbRoutines(JSON.parse(saved))
      } catch (e) {
        setDbRoutines([])
      }
    } else {
      setDbRoutines([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if(view === 'DASHBOARD') fetchRoutines()
  }, [view])

  // 2. LÓGICA DEL CONSTRUCTOR
  const addExerciseToBuilder = () => {
    if(!currentExName.trim() || currentExDuration <= 0) return;
    setNewExercises([...newExercises, { name: currentExName, durationMinutes: currentExDuration }])
    setCurrentExName('')
    setCurrentExDuration(5) 
  }

  const saveRoutineToDB = () => {
    if(!newRoutineName.trim() || newExercises.length === 0) return;
    
    // Convertimos lo que antes iba a SQL, a un objeto plano JSON
    const newRoutine = {
      id: Date.now().toString(), // Generador de identificadores instantáneo
      name: newRoutineName,
      exercises: newExercises
    }

    const updatedCatalog = [...dbRoutines, newRoutine]
    setDbRoutines(updatedCatalog)
    
    // Lo alojamos secretamente en el caché del Chrome / Safari (LocalStorage)
    localStorage.setItem("misRutinasMusicales", JSON.stringify(updatedCatalog))
    
    setNewRoutineName('')
    setNewExercises([])
    setView('DASHBOARD')
  }

  const deleteCustomRoutine = (id) => {
    if(window.confirm('¿Seguro quieres borrar esta rutina de tu memoria?')) {
      const updatedCatalog = dbRoutines.filter(r => r.id !== id)
      setDbRoutines(updatedCatalog)
      localStorage.setItem("misRutinasMusicales", JSON.stringify(updatedCatalog))
    }
  }

  // 3. LÓGICA DEL REPRODUCTOR
  const startRoutine = (routine) => {
    if(routine.exercises.length === 0) return;
    setActiveRoutine(routine)
    setCurrentExerciseIndex(0)
    setTimeLeft(routine.exercises[0].durationMinutes * 60)
    setIsPaused(false)
    setView('PLAYER')
  }

  useEffect(() => {
    if (view === 'PLAYER' && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000) 
    } else if (timeLeft === 0 && view === 'PLAYER') {
      clearInterval(timerRef.current)
      
      // Pasar a la siguiente fase
      if (currentExerciseIndex < activeRoutine.exercises.length - 1) {
        const nextIndex = currentExerciseIndex + 1
        setCurrentExerciseIndex(nextIndex)
        setTimeLeft(activeRoutine.exercises[nextIndex].durationMinutes * 60)
      }
    }
    
    return () => clearInterval(timerRef.current)
  }, [view, isPaused, timeLeft, currentExerciseIndex, activeRoutine])

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const skipExercise = () => setTimeLeft(0) 

  const finishEarly = () => {
    setActiveRoutine(null)
    setView('DASHBOARD')
  }

  return (
    <div className="routines-page">
      {/* VISTA 1: DASHBOARD */}
      {view === 'DASHBOARD' && (
        <div className="dashboard-view" style={{maxWidth:'1200px', margin:'0 auto'}}>
          <div className="theory-header" style={{paddingBottom:'10px'}}>
            <h2 style={{fontSize: '3rem', marginBottom: '10px'}}>🏋️‍♀️ Rutinas de Estudio</h2>
            <p className="helper-text" style={{fontSize: '1.2rem', color: '#b3b3b3'}}>Si alojas esta web en Vercel o Netlify, todos tus ejercicios vivirán en la nube (tu navegador local).</p>
            <button className="play-btn" onClick={() => setView('BUILDER')} style={{marginTop:'20px'}}>+ Construir Entrenamiento Local</button>
          </div>

          <div className="routines-grid" style={{marginTop:'40px', display:'flex', gap:'40px', flexWrap:'wrap'}}>
            {/* Rutinas Browser Memory */}
            <div className="routines-column" style={{flex:1, minWidth:'350px'}}>
              <h3 style={{color:'#1DB954', borderBottom:'2px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>💾 Guardadas en Navegador</h3>
              {loading ? null : dbRoutines.length === 0 ? <p style={{color:'#888', backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px'}}>Aún no tienes rutinas guardadas. Usa el constructor de arriba.</p> : null}
              {dbRoutines.map(r => (
                <div key={r.id} className="routine-card custom-card">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h4>{r.name}</h4>
                    <button className="delete-btn" onClick={() => deleteCustomRoutine(r.id)} title="Borrar">🗑</button>
                  </div>
                  <ul className="routine-ex-list">
                    {r.exercises.map((e, i) => <li key={i}><strong>{e.durationMinutes}m</strong> — {e.name}</li>)}
                  </ul>
                  <button className="start-routine-btn" onClick={() => startRoutine(r)}>▶️ Comenzar Crónometro</button>
                </div>
              ))}
            </div>

            {/* Rutinas Base */}
            <div className="routines-column" style={{flex:1, minWidth:'350px'}}>
              <h3 style={{color:'#fff', borderBottom:'2px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>⭐ Sugerencias Expertas</h3>
              {defaultRoutines.map(r => (
                <div key={r.id} className="routine-card">
                  <h4>{r.name}</h4>
                  <ul className="routine-ex-list">
                    {r.exercises.map((e, i) => <li key={i}><strong>{e.durationMinutes}m</strong> — {e.name}</li>)}
                  </ul>
                  <button className="start-routine-btn" onClick={() => startRoutine(r)}>▶️ Comenzar Crónometro</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: BUILDER LOCAL */}
      {view === 'BUILDER' && (
        <div className="builder-view" style={{maxWidth:'800px', margin:'0 auto', textAlign:'left'}}>
          <button className="back-btn" onClick={() => setView('DASHBOARD')}>← Abandonar Arquitectura</button>
          <h2>🛠️ Creador de Entrenamientos</h2>
          <p style={{color:'#aaa', marginBottom:'20px'}}>Esta rutina se inyectará en la memoria interna de tu Computadora o Celular.</p>

          <div style={{backgroundColor:'#1e1e1e', padding:'35px', borderRadius:'16px'}}>
            <label style={{display:'block', marginBottom:'10px', color:'#1DB954', fontWeight:'bold', fontSize:'1.2rem'}}>Bautiza tu Rutina:</label>
            <input 
              type="text" 
              placeholder="Ej: Sábados de Heavy Metal, Noches de Jazz, Práctica Express..." 
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
              style={{width:'100%', padding:'18px', borderRadius:'8px', backgroundColor:'#0a0a0a', color:'white', border:'1px solid #333', fontSize:'1.3rem', marginBottom:'30px', boxSizing:'border-box'}}
            />

            <h4 style={{color:'#fff', borderBottom:'1px solid #333', paddingBottom:'15px', fontSize:'1.3rem'}}>Listado de Tareas ({newExercises.length} Fases)</h4>
            
            {newExercises.length > 0 ? (
              <ul className="builder-ex-list" style={{marginBottom:'30px', backgroundColor:'#0a0a0a', padding:'20px', borderRadius:'8px', listStyle:'none'}}>
                {newExercises.map((ex, idx) => (
                  <li key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', paddingBottom:'10px', borderBottom:'1px dashed #222'}}>
                    <span style={{fontSize:'1.1rem'}}><strong style={{color:'#1DB954'}}>{ex.durationMinutes} min</strong> - {ex.name}</span>
                    <button onClick={() => setNewExercises(newExercises.filter((_, i) => i !== idx))} style={{background:'none', color:'#ff4a4a', border:'none', cursor:'pointer', fontWeight:'bold'}}>✕ Quitar</button>
                  </li>
                ))}
              </ul>
            ) : (
               <p style={{color:'#666', fontStyle:'italic', marginBottom:'30px'}}>Selecciona misiones en la barra verde para armar tu rutina...</p>
            )}

            <div style={{display:'flex', gap:'15px', alignItems:'center', backgroundColor:'#222', padding:'20px', borderRadius:'8px', flexWrap:'wrap'}}>
               <input 
                 type="text" 
                 placeholder="Ej. Técnica de Púa Alterna..." 
                 value={currentExName}
                 onChange={e => setCurrentExName(e.target.value)}
                 style={{flex:1, minWidth:'250px', padding:'15px', borderRadius:'6px', border:'none', backgroundColor:'#000', color:"white", fontSize:'1.1rem'}}
               />
               <input 
                 type="number" 
                 min="1"
                 max="120"
                 value={currentExDuration}
                 onChange={e => setCurrentExDuration(parseInt(e.target.value))}
                 style={{width:'80px', padding:'15px', borderRadius:'6px', border:'none', backgroundColor:'#000', color:'#1DB954', fontWeight:'bold', fontSize:'1.1rem'}}
               /> <span style={{color:'#aaa', fontWeight:'bold'}}>MINS.</span>
               <button onClick={addExerciseToBuilder} style={{padding:'15px 25px', backgroundColor:'#333', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}>+ Añadir Fase</button>
            </div>

            <button 
               onClick={saveRoutineToDB} 
               style={{width:'100%', padding:'20px', marginTop:'40px', backgroundColor:'var(--primary-color)', color:'#000', fontSize:'1.3rem', fontWeight:'900', border:'none', borderRadius:'12px', cursor:'pointer', textTransform:'uppercase', transition:'all 0.3s'}}
               onMouseOver={(e)=>e.target.style.transform='scale(1.02)'}
               onMouseOut={(e)=>e.target.style.transform='scale(1)'}
            >
               💾 GUARDAR EN ESPACIO LOCAL COMPARTIDO
            </button>
          </div>
        </div>
      )}

      {/* VISTA 3: REPRODUCTOR MAESTRO */}
      {view === 'PLAYER' && activeRoutine && (
        <div className="player-view" style={{textAlign:'center', marginTop:'30px'}}>
           <div className="player-header">
             <h2 style={{color:'#555', textTransform:'uppercase', letterSpacing:'4px'}}>{activeRoutine.name}</h2>
             <p style={{fontSize:'1.3rem', color:'#1DB954', fontWeight:'bold'}}>
               <span style={{color:'#fff'}}>{currentExerciseIndex + 1}</span> de {activeRoutine.exercises.length}
             </p>
           </div>

           {currentExerciseIndex < activeRoutine.exercises.length ? (
             <div className="active-exercise-display" style={{backgroundColor:'#0a0a0a', border:'4px solid #1c1c1c', padding:'80px 20px', borderRadius:'30px', margin:'40px auto', maxWidth:'900px', boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
               <h1 style={{fontSize:'4.5rem', color:'white', marginBottom:'20px', lineHeight:'1.2'}}>
                 {activeRoutine.exercises[currentExerciseIndex].name}
               </h1>
               <div className="timer-giant" style={{fontSize:'10rem', fontWeight:'900', color: isPaused ? '#555' : 'var(--primary-color)', fontFamily:'monospace', textShadow: isPaused ? 'none' : '0 0 50px rgba(29,185,84,0.4)', transition:'color 0.3s'}}>
                 {formatTime(timeLeft)}
               </div>
               <div className="player-controls" style={{display:'flex', justifyContent:'center', gap:'30px', marginTop:'60px'}}>
                 <button onClick={() => setIsPaused(!isPaused)} style={{padding:'20px 50px', fontSize:'1.5rem', fontWeight:'bold', backgroundColor: isPaused ? '#1DB954' : '#333', color: isPaused ? '#000': 'white', border:'none', borderRadius:'40px', cursor:'pointer', transition:'all 0.2s'}}>
                   {isPaused ? '▶️ Reanudar' : '⏸ Pausar'}
                 </button>
                 <button onClick={skipExercise} style={{padding:'20px 50px', fontSize:'1.5rem', fontWeight:'bold', backgroundColor:'#1a1a1a', color:'#888', border:'none', borderRadius:'40px', cursor:'pointer'}}>
                   ⏭ Saltar Ejercicio
                 </button>
               </div>
             </div>
           ) : (
             <div className="routine-finished" style={{backgroundColor:'#1DB954', color:'black', padding:'100px 20px', borderRadius:'30px', margin:'40px auto', maxWidth:'800px'}}>
               <h1 style={{fontSize:'8rem', margin:0}}>🏆</h1>
               <h1 style={{fontSize:'4rem', marginTop:'30px', fontWeight:'900'}}>¡Entrenamiento Finalizado!</h1>
               <button onClick={finishEarly} style={{marginTop:'50px', padding:'25px 60px', fontSize:'1.6rem', fontWeight:'bold', backgroundColor:'black', color:'white', border:'none', borderRadius:'50px', cursor:'pointer'}}>← Volver al Salón</button>
             </div>
           )}
           {currentExerciseIndex < activeRoutine.exercises.length && (
             <button onClick={finishEarly} style={{background:'none', color:'#444', border:'none', fontSize:'1.2rem', cursor:'pointer', textDecoration:'underline', marginTop:'20px'}}>Abortar entrenamiento entero y regresar</button>
           )}
        </div>
      )}
    </div>
  )
}
