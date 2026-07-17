import { api } from '../../shared/api.js'
import { slugify, formatDate } from '../../shared/utils.js'
import { showToast } from '../../shared/store.js'

export function displaysPage() {
  return {
    displays: [],
    loading: false,
    editing: null,
    form: { name: '', slug: '', description: '' },
    search: '',
    page: 1,
    perPage: 10,
    modalOpen: false,
    modalTitle: '',

    async init() {
      await this.load()
    },

    async load() {
      this.loading = true
      try {
        this.displays = await api.displays.list()
      } catch (e) {
        showToast(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    get filtered() {
      if (!this.search) return this.displays
      const q = this.search.toLowerCase()
      return this.displays.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q)
      )
    },

    get paginated() {
      const start = (this.page - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    },

    get pages() {
      return Math.ceil(this.filtered.length / this.perPage)
    },

    onNameInput() {
      if (!this.editing) this.form.slug = slugify(this.form.name)
    },

    openCreate() {
      this.editing = null
      this.form = { name: '', slug: '', description: '' }
      this.modalTitle = 'Create Display'
      this.modalOpen = true
    },

    openEdit(display) {
      this.editing = display
      this.form = {
        name: display.name,
        slug: display.slug,
        description: display.description || '',
      }
      this.modalTitle = 'Edit Display'
      this.modalOpen = true
    },

    closeModal() {
      this.modalOpen = false
    },

    handleBackdropClick(e) {
      if (e.target === e.currentTarget) this.closeModal()
    },

    async save() {
      try {
        if (this.editing) {
          await api.displays.update(this.editing.id, this.form)
          showToast('Display updated')
        } else {
          await api.displays.create(this.form)
          showToast('Display created')
        }
        this.closeModal()
        await this.load()
      } catch (e) {
        showToast(e.message, 'error')
      }
    },

    async confirmDelete(display) {
      if (!confirm(`Delete "${display.name}"? This will also delete all slides.`)) return
      try {
        await api.displays.delete(display.id)
        showToast('Display deleted')
        await this.load()
      } catch (e) {
        showToast(e.message, 'error')
      }
    },

    prevPage() { if (this.page > 1) this.page-- },
    nextPage() { if (this.page < this.pages) this.page++ },
  }
}
