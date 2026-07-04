import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { songsRouter } from './routes/songs.js'
import { routinesRouter } from './routes/routines.js'
import { songsterrRouter } from './routes/songsterr.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/songs', songsRouter)
app.use('/api/routines', routinesRouter)
app.use('/api/songsterr', songsterrRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`MusicLearner API corriendo en http://localhost:${PORT}`)
})
