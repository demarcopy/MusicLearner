import { api, checkBackendHealth } from './api'

const LS_KEY = 'misCanciones'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || []
  } catch {
    return []
  }
}

function saveLocal(songs) {
  localStorage.setItem(LS_KEY, JSON.stringify(songs))
}

export async function getSongs() {
  const online = await checkBackendHealth()
  if (online) {
    const data = await api('/api/songs')
    if (data) return data
  }
  return loadLocal()
}

export async function createSong(song) {
  const online = await checkBackendHealth()
  if (online) {
    const data = await api('/api/songs', {
      method: 'POST',
      body: JSON.stringify(song)
    })
    if (data) return data
  }
  const local = loadLocal()
  const newSong = { ...song, id: Date.now().toString(), content: song.content || '', songsterr_id: song.songsterrId }
  local.push(newSong)
  saveLocal(local)
  return newSong
}

export async function deleteSong(id) {
  const online = await checkBackendHealth()
  if (online) {
    try {
      await api(`/api/songs/${id}`, { method: 'DELETE' })
      return
    } catch {}
  }
  const local = loadLocal().filter(s => s.id !== id)
  saveLocal(local)
}
