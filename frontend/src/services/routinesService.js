import { api, checkBackendHealth } from './api'

const LS_KEY = 'misRutinasMusicales'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || []
  } catch {
    return []
  }
}

function saveLocal(routines) {
  localStorage.setItem(LS_KEY, JSON.stringify(routines))
}

export async function getRoutines() {
  const online = await checkBackendHealth()
  if (online) {
    const data = await api('/api/routines')
    if (data) return data
  }
  return loadLocal()
}

export async function createRoutine(routine) {
  const online = await checkBackendHealth()
  if (online) {
    const data = await api('/api/routines', {
      method: 'POST',
      body: JSON.stringify(routine)
    })
    if (data) return data
  }
  const local = loadLocal()
  const newRoutine = { ...routine, id: Date.now().toString() }
  local.push(newRoutine)
  saveLocal(local)
  return newRoutine
}

export async function deleteRoutine(id) {
  const online = await checkBackendHealth()
  if (online) {
    try {
      await api(`/api/routines/${id}`, { method: 'DELETE' })
      return
    } catch {}
  }
  const local = loadLocal().filter(r => r.id !== id)
  saveLocal(local)
}
