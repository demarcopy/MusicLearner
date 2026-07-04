import { Router } from 'express'
import { query, validationResult } from 'express-validator'

export const songsterrRouter = Router()

const SONGSTERR_SEARCH_URL = 'http://www.songsterr.com/a/ra/songs.json'

songsterrRouter.get('/',
  query('q').notEmpty().withMessage('El parámetro de búsqueda "q" es requerido'),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const searchTerm = req.query.q
      const url = `${SONGSTERR_SEARCH_URL}?pattern=${encodeURIComponent(searchTerm)}`

      const response = await fetch(url)

      if (!response.ok) {
        return res.status(502).json({
          error: 'Songsterr no respondió correctamente',
          status: response.status
        })
      }

      const data = await response.json()
      const results = Array.isArray(data) ? data.slice(0, 10) : []
      res.json(results)
    } catch (err) {
      next(err)
    }
  }
)
