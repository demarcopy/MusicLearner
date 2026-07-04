import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { supabase } from '../db.js'

export const routinesRouter = Router()

const handleErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

routinesRouter.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

routinesRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) return res.status(404).json({ error: 'Rutina no encontrada' })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

routinesRouter.post('/',
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('exercises').isArray({ min: 1 }).withMessage('Debe incluir al menos un ejercicio'),
  body('exercises.*.name').notEmpty().withMessage('Cada ejercicio debe tener nombre'),
  body('exercises.*.durationMinutes').isInt({ min: 1 }).withMessage('Cada ejercicio debe tener duración positiva'),
  handleErrors,
  async (req, res, next) => {
    try {
      const { name, exercises } = req.body
      const { data, error } = await supabase
        .from('routines')
        .insert({ name, exercises })
        .select()
        .single()

      if (error) throw error
      res.status(201).json(data)
    } catch (err) {
      next(err)
    }
  }
)

routinesRouter.put('/:id',
  param('id').isUUID(),
  body('name').optional().isString(),
  body('exercises').optional().isArray({ min: 1 }),
  handleErrors,
  async (req, res, next) => {
    try {
      const updates = {}
      if (req.body.name !== undefined) updates.name = req.body.name
      if (req.body.exercises !== undefined) updates.exercises = req.body.exercises

      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', req.params.id)
        .select()
        .single()

      if (error) return res.status(404).json({ error: 'Rutina no encontrada' })
      res.json(data)
    } catch (err) {
      next(err)
    }
  }
)

routinesRouter.delete('/:id',
  param('id').isUUID(),
  handleErrors,
  async (req, res, next) => {
    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', req.params.id)

      if (error) return res.status(404).json({ error: 'Rutina no encontrada' })
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)
