export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message)

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  })
}
