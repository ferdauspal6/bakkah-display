const state = {
  displays: [],
  slides: [],
  currentDisplay: null,
  currentSlide: null,
  selectedDisplayId: null,
  loading: false,
  error: null,
  toast: null,
}

const listeners = new Set()

export function getState() {
  return state
}

export function setState(updates) {
  Object.assign(state, updates)
  listeners.forEach((fn) => fn(state))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function showToast(message, type = 'success') {
  setState({ toast: { message, type } })
  setTimeout(() => setState({ toast: null }), 3000)
}
