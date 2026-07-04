const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function api(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw { status: res.status, message: body.error || 'Error en la API' }
    }
    if (res.status === 204) return null
    return await res.json()
  } catch (err) {
    if (err.status) throw err
    return null
  }
}

export async function checkBackendHealth() {
  const result = await api('/api/health')
  return result?.status === 'ok'
}
