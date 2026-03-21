import { useState } from 'react'

const syllabus = [
  {
    level: "Nivel 1: Iniciante",
    lessons: [
      { 
        id: 1, 
        title: "¿Qué es el sonido y las notas?", 
        content: "El sonido es una onda. En música moderna usamos 12 notas repetitivas (Sistema Cromático): Do, Do#, Re, Re#, Mi, Fa, Fa#, Sol, Sol#, La, La#, Si. \n\nNo todas llevan sostenidos '#'. El 'Mi' y el 'Si' pasan directo a la siguiente nota."
      },
      { 
        id: 2, 
        title: "La Guitarra en tus Manos", 
        content: "La guitarra tradicional tiene 6 cuerdas. Si las tocas 'al aire' (sin pisar ningún traste) empezando desde la más gruesa a la más fina, las notas son:\n\n6. Mi (E)\n5. La (A)\n4. Re (D)\n3. Sol (G)\n2. Si (B)\n1. Mi (E)" 
      }
    ]
  },
  {
    level: "Nivel 2: Intermedio",
    lessons: [
      { 
        id: 3, 
        title: "La magia de los Acordes Mayores", 
        content: "Un acorde es tocar más de 3 notas simultáneas. Para armar un acorde MAYOR (Que suena feliz) necesitas una fórmula matemática de escalones llamada 'Intervalos'. \n\nFórmula Mayor: Tónica + 4 semitonos arriba (Tercera) + 3 semitonos arriba (Quinta)." 
      },
      { 
        id: 4, 
        title: "Reina del Rock: La Pentatónica", 
        content: "Todas las escalas completas tienen 7 notas, pero la Pentatónica solo usa 5 (Penta). Elimina las notas tensas de la escala dejando un sonido rudo ideal para hacer solos de Rock y Blues sin equivocarte de traste nunca." 
      }
    ]
  }
]

export default function Theory() {
  const [activeLesson, setActiveLesson] = useState(null)

  return (
    <div className="theory-container">
      <div className="theory-header">
        <h2>📖 Curso de Teoría Musical</h2>
        <p className="helper-text">Selecciona una lección de la barra lateral izquierda para desbloquear sus secretos.</p>
      </div>
      
      <div className="theory-layout">
        {/* Panel lateral con el temario (Syllabus) */}
        <div className="syllabus-sidebar">
          {syllabus.map((section, idx) => (
            <div key={idx} className="syllabus-section">
              <h3>{section.level}</h3>
              <ul>
                {section.lessons.map(lesson => (
                  <li 
                    key={lesson.id} 
                    className={activeLesson?.id === lesson.id ? 'active-lesson' : ''}
                    onClick={() => setActiveLesson(lesson)}
                  >
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Visor de la lección seleccionada */}
        <div className="lesson-viewer">
          {activeLesson ? (
            <div className="lesson-content bounce-in">
              <h2>{activeLesson.title}</h2>
              <div className="lesson-body">
                {activeLesson.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-lesson">
              <p>👈 Haz clic en una lección del temario para comenzar a estudiar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
