import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { supabase } from '../db.js'

export const songsRouter = Router()

const handleErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

songsRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

songsRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) return res.status(404).json({ error: 'Canción no encontrada' })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

songsRouter.post('/',
  body('title').notEmpty().withMessage('El título es requerido'),
  body('artist').notEmpty().withMessage('El artista es requerido'),
  body('content').optional().isString(),
  body('songsterrId').optional().isInt(),
  handleErrors,
  async (req, res, next) => {
    try {
      const { title, artist, content, songsterrId } = req.body
      const { data, error } = await supabase
        .from('songs')
        .insert({ title, artist, content: content || '', songsterr_id: songsterrId || null })
        .select()
        .single()

      if (error) throw error
      res.status(201).json(data)
    } catch (err) {
      next(err)
    }
  }
)

songsRouter.put('/:id',
  param('id').isUUID(),
  body('title').optional().isString(),
  body('artist').optional().isString(),
  body('content').optional().isString(),
  handleErrors,
  async (req, res, next) => {
    try {
      const updates = {}
      if (req.body.title !== undefined) updates.title = req.body.title
      if (req.body.artist !== undefined) updates.artist = req.body.artist
      if (req.body.content !== undefined) updates.content = req.body.content

      const { data, error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single()

      if (error) return res.status(404).json({ error: 'Canción no encontrada' })
      res.json(data)
    } catch (err) {
      next(err)
    }
  }
)

songsRouter.delete('/:id',
  param('id').isUUID(),
  handleErrors,
  async (req, res, next) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', req.params.id)

      if (error) return res.status(404).json({ error: 'Canción no encontrada' })
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)
