import { useState } from 'react'
import { Scale, Chord, Note } from '@tonaljs/tonal'

const notesList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const enToEs = {
  'C': 'Do', 'C#': 'Do# / Reb', 'D': 'Re', 'D#': 'Re# / Mib', 'E': 'Mi', 'F': 'Fa', 'F#': 'Fa# / Solb',
  'G': 'Sol', 'G#': 'Sol# / Lab', 'A': 'La', 'A#': 'La# / Sib', 'B': 'Si'
}

export default function Theory() {
  const [activeLesson, setActiveLesson] = useState(1)
  
  const [scaleRoot, setScaleRoot] = useState('C')
  const [scaleType, setScaleType] = useState('major')
  const [chordRoot, setChordRoot] = useState('C')
  const [chordType, setChordType] = useState('major')

  const currentScale = Scale.get(`${scaleRoot} ${scaleType}`)
  const currentChord = Chord.get(`${chordRoot} ${chordType}`)

  const syllabus = [
    {
      level: "Nivel 1: Vocabulario",
      lessons: [
        { id: 1, title: "1. Tono y Semitono" },
        { id: 2, title: "2. Las 12 Notas Musicales" },
        { id: 3, title: "3. El Pentagrama" },
        { id: 4, title: "4. Pulso y Compás" },
        { id: 5, title: "5. Figuras Rítmicas" }
      ]
    },
    {
      level: "Nivel 2: Intervalos Musicales",
      lessons: [
        { id: 6, title: "6. ¿Qué es un Intervalo?" },
        { id: 7, title: "7. Intervalos Fundamentales" },
        { id: 8, title: "8. Construcción (Escalas y Acordes)" },
        { id: 9, title: "9. Tocarlos en la Guitarra" }
      ]
    },
    {
      level: "Nivel 3: Laboratorios",
      lessons: [
        { id: 10, title: "10. Lab: Escalas (Tonal)" },
        { id: 11, title: "11. Lab: Acordes (Tonal)" }
      ]
    }
  ]

  const renderLesson = () => {
    switch(activeLesson) {
      // --- NIVEL 1 ---
      case 1:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Tono y Semitono (La regla para medir)</h3>
            <p>En la música, medimos la distancia entre dos sonidos usando <strong>Tonos</strong> y <strong>Semitonos</strong>, así como usas "Centímetros" y "Metros" en la vida real.</p>
            <ul style={{backgroundColor:'#1e1e1e', padding:'20px 40px', borderRadius:'8px', lineHeight:'1.8'}}>
              <li style={{marginBottom:'15px'}}><strong>Semitono (1/2):</strong> Es la distancia ínfima y mínima que existe entre dos sonidos en la música occidental. Al tocar la guitarra, equivale a mover el dedo exactamente <strong>1 traste a la derecha</strong> o izquierda.</li>
              <li><strong>Tono (1):</strong> Es la suma de <strong>2 semitonos</strong> consecutivos. Al tocar la guitarra, esto significa avanzar deslizando tu dedo y <strong>saltarte 2 trastes</strong>.</li>
            </ul>
            <p><strong>Ejemplo Real:</strong> De "Do" a "Do sostenido (Do#)" hay 1 Semitono. De "Do" a "Re" hay 1 Tono entero.</p>
          </div>
        )
      case 2:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Las 12 Notas (Cifrado Universal)</h3>
            <p>Casi todas las webs reales de Tablaturas (como Songsterr) escriben las notas en su idioma <strong>Inglés (Cifrado Americano)</strong> donde se representan por las primeras letras del alfabeto (A-G).</p>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px', marginTop:'20px'}}>
              <div>
                <strong style={{color:'#1DB954'}}>Cifrado Americano</strong>
                <ul style={{listStyle:'none', padding:0, color:'#ccc', lineHeight:'2.2'}}>
                  <li>🎸 <strong>A</strong></li><li>🎸 <strong>B</strong></li><li>🎸 <strong>C</strong></li>
                  <li>🎸 <strong>D</strong></li><li>🎸 <strong>E</strong></li><li>🎸 <strong>F</strong></li><li>🎸 <strong>G</strong></li>
                </ul>
              </div>
              <div>
                <strong style={{color:'#1DB954'}}>Latinoamérica</strong>
                <ul style={{listStyle:'none', padding:0, color:'#ccc', lineHeight:'2.2'}}>
                  <li>🎹 <strong>La</strong></li><li>🎹 <strong>Si</strong></li><li>🎹 <strong>Do</strong></li>
                  <li>🎹 <strong>Re</strong></li><li>🎹 <strong>Mi</strong></li><li>🎹 <strong>Fa</strong></li><li>🎹 <strong>Sol</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>El Pentagrama Analítico</h3>
            <p>El pentagrama no es otra cosa que nuestra hoja cuadriculada. Su nombre proviene del latín <em>Penta</em> (Cinco) y <em>Grama</em> (Línea).</p>
            <p>Consiste en <strong>5 líneas paralelas</strong> que generan un total de <strong>4 espacios</strong>. Se lee siempre de la línea inferior hacia la punta superior.</p>
            <p>Pero el pentagrama solo no nos dice nada si no tiene una <strong>Clave</strong> guía al inicio:</p>
            <ul style={{backgroundColor:'#1e1e1e', padding:'20px 40px', borderRadius:'8px', lineHeight:'1.6'}}>
              <li style={{marginBottom:'15px'}}><strong>Clave de Sol (𝄞):</strong> Instrumentos agudos (Guitarra Acústica, Cantantes, mano derecha del piano). Fija que la 2da línea se llamará "Sol".</li>
              <li><strong>Clave de Fa (𝄢):</strong> Instrumentos graves (Bajo Eléctrico, mano izquierda del piano).</li>
            </ul>
          </div>
        )
      case 4:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Pulso, Ritmo y Compás</h3>
            <p>Estos tres engranajes son el corazón de la música en el tiempo:</p>
            <ul style={{lineHeight:'1.8'}}>
              <li style={{marginBottom:'20px'}}><strong>1. El Pulso:</strong> El "reloj" o latido continuo. Cuando marcas el ritmo de la canción golpeando el pie contra el suelo repetidamente, estás siguiendo el Pulso inquebrantable.</li>
              <li style={{marginBottom:'20px'}}><strong>2. El Compás:</strong> Agrupa los pulsos matemáticamente para ordenarlos (en cajas). El formato rey del rock es el <em>4/4</em> (cuentas cíclicamente "Un, Dos, Tres, Cuatro").</li>
              <li style={{marginBottom:'20px'}}><strong>3. El Ritmo:</strong> La verdadera magia asimétrica. El ritmo es lo que el músico toca <strong>montado encima</strong> del pulso que fluye de fondo.</li>
            </ul>
          </div>
        )
      case 5:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Figuras Rítmicas de Partitura</h3>
            <p>Las figuras nos dictan <strong>cuánto tiempo debe sostenerse un sonido</strong> antes de cortarse, basándose en nuestro Pulso:</p>
            <ul style={{backgroundColor:'#1e1e1e', padding:'20px 40px', borderRadius:'8px', lineHeight:'1.8'}}>
              <li style={{marginBottom:'15px'}}><strong>🔴 Redonda (𝅝):</strong> Dura <strong>4 pulsos completos</strong>. Si nuestro compás es de 4/4, rellenará una "caja" ella sola de esquina a esquina.</li>
              <li style={{marginBottom:'15px'}}><strong>🔵 Blanca (𝅗𝅥):</strong> Dura <strong>2 pulsos</strong>. Es exactamente Medio compás.</li>
              <li style={{marginBottom:'15px'}}><strong>⚫ Negra (♩):</strong> Dura <strong>1 pulso</strong>. La más legendaria. Es el equivalente a que cada vez que tu pie toque el suelo, toques una nota.</li>
              <li style={{marginBottom:'15px'}}><strong>🎵 Corchea (♪):</strong> Dura <strong>1/2 pulso</strong>. Entran dos corcheas veloces en cada golpe de latido de la canción.</li>
            </ul>
          </div>
        )

      // --- NIVEL 2 ---
      case 6:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>¿Qué es un Intervalo Musical?</h3>
            <p>Ya dominas cómo medir distancias crudas ("Avanza 1 Tono, avanza 3 Semitonos"). Bueno, un <strong>Intervalo</strong> es simplemente el <strong>nombre profesional y musical</strong> que le damos a esas distancias matemáticas frías.</p>
            <p>Imagina que las notas musicales fueran ciudades: El "Tono/Semitono" son los *Kilómetros* de las rutas que las conectan, y el "Intervalo" es el *Nombre Comercial* romántico de esa autopista.</p>
            <p><strong>Entender los intervalos es el paso definitivo para graduarte como gran músico.</strong> Si conoces el "nombre" de las carreteras de la música, tu cerebro ya no tendrá que memorizar miles de posiciones estáticas de guitarra (como robots); podrás improvisar y armar tus propios acordes inventados desde tu mente.</p>
          </div>
        )
      case 7:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Los 2 Intervalos Fundamentales</h3>
            <p>De todos los intervalos existentes, solo necesitas controlar con precisión estos dos cimientos de arquitectura para dominar el 90% de los grandes himnos de la humanidad (Acordes Mayores, Menores y Power Chords):</p>
            <ul style={{backgroundColor:'#1e1e1e', padding:'20px 40px', borderRadius:'8px', lineHeight:'1.8', border:'1px solid #333'}}>
              <li style={{marginBottom:'15px'}}>
                <span style={{fontSize:'1.2rem', color:'#fff'}}>🎸 Las Terceras (3) - Tonalidad</span><br/>
                Las Terceras definen si el acorde es Feliz o Triste de manera fulminante.<br/>
                <strong>- Tercera Mayor (3M):</strong> Suena gloriosa, alegre y épica. Aparece cuando la distancia es de exactamente <strong>4 Semitonos (2 Tonos completos)</strong> desde la base.<br/>
                <strong>- Tercera Menor (3m):</strong> Suena trágica y profunda. Aparece cuando la distancia es de <strong>3 Semitonos (1 Tono y medio)</strong> de tu nota base.
              </li>
              <li>
                <span style={{fontSize:'1.2rem', color:'#fff'}}>🎸 La Quinta Justa (5J) - Estabilidad</span><br/>
                Es el intervalo de la fuerza bruta y total "ausencia de emociones". Ni alegre, ni triste: Sólida. Mide exactamente <strong>7 Semitonos</strong> de distancia desde la nota base. Si tocas en guitarra una Tónica (raíz) únicamente junto a su Quinta Justa, invocas el destructivo <strong>Power Chord (Acorde de Quinta)</strong>, la inquebrantable arma base del Rock Pesado, el Punk y el Metal.
              </li>
            </ul>
          </div>
        )
      case 8:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Construcción de Acordes y Escalas</h3>
            <p>Al dominar los Intervalos (distancias medidas), pasas de copiar posiciones de la web a convertirte en Arquitecto Armónico de Legos. Toda fórmula musical recae en ellos:</p>
            
            <div style={{backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px', marginTop:'20px'}}>
              <h4 style={{color:'#fff', marginTop:0}}>🧱 Estructurando un Acorde (La Tríada)</h4>
              <p style={{color:'#ccc'}}>Todo acorde del mundo se cimenta al acumular ("apilar verticalmente") intervalos uno arriba del otro. La Sagrada Tríada (fórmula para acordes puros) siempre demanda 3 cosas imprescindibles:</p>
              <ul style={{color:'var(--primary-color)', fontWeight:'bold'}}>
                <li>Tónica (Raíz y apellido del acorde)</li>
                <li>+ Componente 2: Intervalo de Tercera (Que dictará si es acorde Mayor o Menor)</li>
                <li>+ Componente 3: Intervalo de Quinta Justa (Para darle robustez inamovible)</li>
              </ul>
            </div>

            <div style={{backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px', marginTop:'20px'}}>
              <h4 style={{color:'#fff', marginTop:0}}>🧱 Estructurando una Escala (Los Pasos Mágicos)</h4>
              <p style={{color:'#ccc'}}>Si el acorde se apila hacia arriba, la "Escala" se encadena en línea recta (Saltos horizontales en un puente). Por ejemplo, la <em>Escala Mayor</em> tiene una secuencia genética estricta universal en la raza humana: <strong>T - T - S - T - T - T - S</strong> (Donde "T" significa avanzar 1 Tono y "S" avanzar un Semitono). 
              <br/><br/>
              Abre tu guitarra de cero con un amigo: Si él elige una nota cualquiera al azar en el mástil y aplicas la regla <em>"T-T-S-T-T-T-S"</em>, habrás parido sin esfuerzo la Escala Mayor mágica de esa letra en vivo y en directo, sin acudir al profesor.</p>
            </div>
          </div>
        )
      case 9:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>¿Cómo se tocan visualmente en la Guitarra?</h3>
            <p>Tenemos una enorme ventaja geométrica contra el Piano: <strong>En la Guitarra Física los Intervalos SIEMPRE dibujan la misma figura geométrica en los dedos</strong> (Shape), indiferentemente si estás tocando en el segundo traste ("Fa") o perdiéndote al fondo del mástil en el Traste 12("Mi"). Los moldes no cambian.</p>
            
            <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
              <div style={{backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px', flex:'1', minWidth:'300px'}}>
                <h4 style={{color:'#fff', marginTop:0}}>Molde Visual: Power Chord (La 5 J)</h4>
                <p style={{color:'#ccc'}}>Para hacer vibrar esa majestuosa <strong>Quinta Justa (a 7 semitonos)</strong> para tocar Rock crudo necesitas 2 dedos, y es brutalmente sencillo:</p>
                <ol>
                  <li>Posa tu Dedo Índice líder en la cuerda más gruesa en un traste cualquiera.</li>
                  <li>Ubica tu Dedo Anular bajando a la cuerda inferior (más delgada), y arrástralo <strong>exactamente DOS TRASTES </strong> a la derecha del índice.</li>
                </ol>
                <p>¡Acabas de dibujar el intervalo de Quinta en carne viva! Mueve la mano armada así por todo el largo de la guitarra y no fallará jamás.</p>
              </div>

              <div style={{backgroundColor:'#1e1e1e', padding:'20px', borderRadius:'8px', flex:'1', minWidth:'300px'}}>
                <h4 style={{color:'#fff', marginTop:0}}>Molde Visual: Las Terceras Base</h4>
                <p style={{color:'#ccc'}}>El pincel emocional de tus notas base a la hora de hacer un punteo o "Solo" principal.</p>
                <ul>
                  <li style={{marginBottom:'10px'}}><strong>Mapeando Tercera Mayor (3M / Alegre):</strong> Tu Dedo 1 presiona la cuerda arriba. Tu otro dedo reposará en la cuerda directamente inferior, corrido <strong>un 1 traste atrás (izquierda)</strong> con respecto al líder.</li>
                  <li><strong>Mapeando Tercera Menor (3m / Triste):</strong> En la MSMA cuerda lineal, solo requiere avanzar tu dedo <strong>exactamente 3 trastes a la derecha (+ 3 Semitonos)</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // --- NIVEL 3 (Laboratorios) ---
      case 10:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Laboratorio de Escalas Diatónicas</h3>
            <p>Verifica visualmente la lección 8: Cambia la nota base y comprueba como Tonal.js aplica la estructura matemática exacta de la Escala Mayor.</p>
            <div className="interactive-box" style={{backgroundColor: '#1e1e1e', padding: '25px', borderRadius:'12px', marginTop:'20px', border: '1px solid rgba(255,255,255,0.1)'}}>
              <h4 style={{color: '#fff', marginTop: 0, fontSize: '1.4rem'}}>🔬 Consola de Escalas</h4>
              <div style={{display:'flex', gap:'15px', marginBottom: '25px'}}>
                <select value={scaleRoot} onChange={e => setScaleRoot(e.target.value)} style={{padding:'12px', backgroundColor:'#2b2b2b', color:'white', border:'1px solid #444', borderRadius:'8px', outline:'none', fontSize:'1rem'}}>
                  {notesList.map(n => <option key={n} value={n}>Nota Base {enToEs[n].split(' ')[0]} ({n})</option>)}
                </select>
                <select value={scaleType} onChange={e => setScaleType(e.target.value)} style={{padding:'12px', backgroundColor:'#2b2b2b', color:'white', border:'1px solid #444', borderRadius:'8px', outline:'none', fontSize:'1rem'}}>
                  <option value="major">Escala Mayor (Épica)</option>
                  <option value="minor">Escala Menor (Sensible/Triste)</option>
                  <option value="minor pentatonic">Pentatónica Menor (Rock)</option>
                </select>
              </div>

              <div style={{backgroundColor: '#000', padding: '20px', borderRadius: '8px'}}>
                <strong style={{color:'#888', textTransform:'uppercase', fontSize:'0.8rem'}}>Frecuencias Calculadas de Salida: </strong><br/><br/>
                <span style={{color: '#fff', fontSize: '1.5rem', fontWeight: 'bold'}}>
                  {currentScale.notes.map(n => (enToEs[Note.pitchClass(n)] || n).split(' ')[0]).join('  —  ')}
                </span>
              </div>
            </div>
          </div>
        )
      case 11:
        return (
          <div className="lesson-body">
            <h3 style={{color: '#1DB954'}}>Laboratorio Analítico de Acordes</h3>
            <p>Audita cualquier Acorde mediante sus Intervalos ("Tríada Clásica de Tercera y Quinta"). Fíjate como todos los Acordes Mayores comparten la métrica `[1P, 3M, 5P]` sin excepción de la tónica inicial.</p>
            <div className="interactive-box" style={{backgroundColor: '#1e1e1e', padding: '25px', borderRadius:'12px', marginTop:'20px', border: '1px solid rgba(255,255,255,0.1)'}}>
              <h4 style={{color: '#fff', marginTop: 0, fontSize: '1.4rem'}}>🔬 Desarmador de Acordes (Inspect)</h4>
              <div style={{display:'flex', gap:'15px', marginBottom: '25px'}}>
                <select value={chordRoot} onChange={e => setChordRoot(e.target.value)} style={{padding:'12px', backgroundColor:'#2b2b2b', color:'white', border:'1px solid #444', borderRadius:'8px', outline:'none', fontSize:'1rem'}}>
                  {notesList.map(n => <option key={n} value={n}>Cimiento {enToEs[n].split(' ')[0]} ({n})</option>)}
                </select>
                <select value={chordType} onChange={e => setChordType(e.target.value)} style={{padding:'12px', backgroundColor:'#2b2b2b', color:'white', border:'1px solid #444', borderRadius:'8px', outline:'none', fontSize:'1rem'}}>
                  <option value="major">Tríada Mayor Estándar</option>
                  <option value="minor">Tríada Menor (m)</option>
                  <option value="maj7">Mayor Séptima Aislada (maj7)</option>
                  <option value="m7">Menor Séptima (m7)</option>
                </select>
              </div>

              <div style={{backgroundColor: '#000', padding: '20px', borderRadius: '8px', lineHeight:'1.8'}}>
                <strong style={{color:'#888'}}>Métricas de Distancia de los "Legos" (Intervalos en Inglés): </strong> 
                <span style={{color:'#aaa', backgroundColor:'#222', padding:'4px 8px', borderRadius:'4px'}}>{currentChord.intervals.join(' 〰 ')}</span><br/><br/>
                
                <strong style={{color:'#1DB954', fontSize:'1.1rem'}}>Cuerdas y Notas exactas que conforman el Acorde en esta tonalidad: </strong><br/>
                <span style={{color: '#fff', fontSize: '1.6rem', fontWeight: 'bold'}}>
                  {currentChord.notes.map(n => (enToEs[Note.pitchClass(n)] || n).split(' ')[0]).join('  +  ')}
                </span>
              </div>
            </div>
          </div>
        )
      default:
        return <p>Selecciona una lección para iniciar.</p>
    }
  }

  return (
    <div className="theory-container" style={{maxWidth:'1300px', margin:'0 auto'}}>
      <div className="theory-header" style={{paddingBottom:'30px'}}>
        <h2 style={{fontSize: '3rem', marginBottom: '10px'}}>📖 Laboratorio Teórico Interactivo</h2>
        <p className="helper-text" style={{fontSize: '1.2rem', color: '#b3b3b3'}}>Bienvenido a los cimientos profesionales del músico moderno. Combinamos lecciones explícitas con herramientas reactivas.</p>
      </div>
      
      <div className="theory-layout">
        {/* Panel lateral con el temario general */}
        <div className="syllabus-sidebar">
          {syllabus.map((section, sIndex) => (
            <div key={sIndex} className="syllabus-section" style={{marginBottom: '20px'}}>
              <h3 style={{fontSize:'1.1rem', paddingBottom:'5px'}}>{section.level}</h3>
              <ul style={{marginTop:'5px'}}>
                {section.lessons.map(lesson => (
                  <li 
                    key={lesson.id} 
                    className={activeLesson === lesson.id ? 'active-lesson' : ''}
                    onClick={() => setActiveLesson(lesson.id)}
                    style={{fontSize:'1rem', padding:'12px'}}
                  >
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Visor de la selección activa */}
        <div className="lesson-viewer">
          <div className="lesson-content bounce-in">
            <h2 style={{color: '#fff', borderBottom: '1px solid #333', paddingBottom:'15px', fontSize:'2.2rem'}}>
              {syllabus.flatMap(s => s.lessons).find(l => l.id === activeLesson)?.title}
            </h2>
            {renderLesson()}
          </div>
        </div>
      </div>
    </div>
  )
}
