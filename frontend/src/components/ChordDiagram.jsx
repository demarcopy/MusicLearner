import React from 'react';
import './ChordDiagram.css';

// Diccionario geométrico para dibujar las tablaturas
// -1: X (No rasguear), 0: Cuerda suelta, >0: Traste a pisar
const chordShapes = {
  'C': [-1, 3, 2, 0, 1, 0],
  'Cm': [-1, 3, 5, 5, 4, 3],
  'C5': [-1, 3, 5, 5, -1, -1],
  
  'D': [-1, -1, 0, 2, 3, 2],
  'Dm': [-1, -1, 0, 2, 3, 1],
  'D5': [-1, 5, 7, 7, -1, -1],
  
  'E': [0, 2, 2, 1, 0, 0],
  'Em': [0, 2, 2, 0, 0, 0],
  'E5': [0, 2, 2, -1, -1, -1],
  
  'F': [1, 3, 3, 2, 1, 1],  
  'Fm': [1, 3, 3, 1, 1, 1],
  'F5': [1, 3, 3, -1, -1, -1],
  
  'G': [3, 2, 0, 0, 0, 3],
  'Gm': [3, 5, 5, 3, 3, 3],
  'G5': [3, 5, 5, -1, -1, -1],
  
  'A': [-1, 0, 2, 2, 2, 0],
  'Am': [-1, 0, 2, 2, 1, 0],
  'A5': [-1, 0, 2, 2, -1, -1],
  
  'B': [-1, 2, 4, 4, 4, 2],
  'Bm': [-1, 2, 4, 4, 3, 2],
  'B5': [-1, 2, 4, 4, -1, -1]
}

export default function ChordDiagram({ chordName }) {
  const shape = chordShapes[chordName];
  if (!shape) return null;

  const playedFrets = shape.filter(f => f > 0);
  let minFret = 1;
  let maxFret = 4;
  
  if (playedFrets.length > 0) {
     minFret = Math.min(...playedFrets);
     maxFret = Math.max(...playedFrets);
  }

  // Lógica de Cejilla: Si la tablatura requiere trastes lejanos, arrastramos la ventana visual desde el minFret
  let startFret = 1;
  if (maxFret > 4) {
      startFret = minFret;
  }

  const width = 160;
  const height = 180;
  const numStrings = 6;
  const numFrets = 4; // Ventana visual estándar
  
  const hSpacing = width / (numStrings - 1);
  const vSpacing = height / numFrets;

  return (
    <div className="chord-diagram">
      <div className="diagram-header">
        {shape.map((fret, i) => (
          <div key={i} className={`string-status ${fret === -1 ? 'muted' : fret === 0 ? 'open' : ''}`}>
            {fret === -1 ? 'X' : fret === 0 ? 'O' : ''}
          </div>
        ))}
      </div>
      
      {/* Construímos el mástil de la Guitarra Vectorizado (SVG) */}
      <svg width={width} height={height} className="fretboard-svg">
        
        {/* Líneas Horizontales (Trastes de metal) */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={'fret' + i}
            x1="0" y1={i * vSpacing}
            x2={width} y2={i * vSpacing}
            stroke={i === 0 && startFret === 1 ? "#fff" : "#444"} // La cejilla ósea superior brilla de blanco
            strokeWidth={i === 0 && startFret === 1 ? "6" : "2"}
          />
        ))}
        
        {/* Líneas Verticales (Cuerdas de la guitarra) */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={'string' + i}
            x1={i * hSpacing} y1="0"
            x2={i * hSpacing} y2={height}
            stroke="#888"
            strokeWidth={i < 3 ? "3" : "1.5"} // Cuerdas graves más gruesas
          />
        ))}
        
        {/* Puntos (Dedos de tablatura apretados en trastes reales) */}
        {shape.map((fret, i) => {
          if (fret > 0) {
            const relativeFret = fret - startFret + 1;
            // Solo imprimimos los dedos correspondientes a la ventana de 4 trastes actual
            if (relativeFret >= 1 && relativeFret <= 4) {
              return (
                <circle
                  key={'dot' + i}
                  cx={i * hSpacing}
                  cy={(relativeFret - 0.5) * vSpacing}
                  r="14"
                  fill="#1DB954"
                />
              )
            }
          }
          return null;
        })}
      </svg>
      
      {/* Etiqueta métrica por si el mástil bajó al Traste 3 (Como un C menor) */}
      {startFret > 1 && (
        <div className="fret-number" style={{ position: 'absolute', top: '35px', left: '-40px', color: '#ccc', fontWeight: 'bold', fontSize: '1.2rem' }}>
          {startFret}fr
        </div>
      )}
    </div>
  );
}
