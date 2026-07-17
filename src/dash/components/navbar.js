export function navbarComponent() {
  return {
    displays: [],
    selectedDisplayId: null,
    async init() {
      const { api } = await import('../../shared/api.js')
      this.displays = await api.displays.list()
    },
    onDisplayChange(id) {
      this.$dispatch('display-changed', { displayId: id })
    },
  }
}
