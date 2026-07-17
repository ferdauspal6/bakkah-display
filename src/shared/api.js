const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  displays: {
    list: () => request('/displays'),
    get: (id) => request(`/displays/${id}`),
    create: (data) => request('/displays', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/displays/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/displays/${id}`, { method: 'DELETE' }),
  },
  slides: {
    list: (displayId) => request(`/slides?displayId=${displayId}`),
    get: (id) => request(`/slides/${id}`),
    create: (data) => request('/slides', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/slides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateOrder: (id, sortOrder) => request(`/slides/${id}/order`, { method: 'PUT', body: JSON.stringify({ sortOrder }) }),
    delete: (id) => request(`/slides/${id}`, { method: 'DELETE' }),
  },
  display: {
    getBySlug: (slug) => request(`/display/${slug}`),
  },
}
