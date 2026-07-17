import { api } from '../../shared/api.js'
import { showToast } from '../../shared/store.js'

export function slidesPage() {
  return {
    displays: [],
    slides: [],
    selectedDisplayId: null,
    loading: false,
    editing: null,
    form: {
      displayId: null,
      title: '',
      type: 'html',
      content: '',
      duration: 10,
      sortOrder: 0,
      transition: 'fade',
      enabled: true,
      youtubeVideos: [''],
    },
    search: '',
    page: 1,
    perPage: 10,
    dragIndex: null,
    modalOpen: false,
    modalTitle: '',

    async init() {
      try {
        this.displays = await api.displays.list()
      } catch (e) {
        showToast('Failed to load displays', 'error')
      }
    },

    async selectDisplay(id) {
      this.selectedDisplayId = id
      this.form.displayId = id
      await this.load()
    },

    async load() {
      if (!this.selectedDisplayId) {
        this.slides = []
        return
      }
      this.loading = true
      try {
        this.slides = await api.slides.list(this.selectedDisplayId)
      } catch (e) {
        showToast(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    get filtered() {
      if (!this.search) return this.slides
      const q = this.search.toLowerCase()
      return this.slides.filter((s) => s.title.toLowerCase().includes(q))
    },

    get paginated() {
      const start = (this.page - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    },

    get pages() {
      return Math.ceil(this.filtered.length / this.perPage)
    },

    getSlideBadge(type) {
      return { html: 'HTML', iframe: 'Iframe', image: 'Image', youtube: 'YouTube' }[type] || type
    },

    openCreate() {
      if (!this.selectedDisplayId) {
        showToast('Select a display first', 'error')
        return
      }
      this.editing = null
      this.form = {
        displayId: this.selectedDisplayId,
        title: '',
        type: 'html',
        content: '',
        duration: 10,
        sortOrder: this.slides.length,
        transition: 'fade',
        enabled: true,
        youtubeVideos: [''],
      }
      this.modalTitle = 'Create Slide'
      this.modalOpen = true
    },

    openEdit(slide) {
      this.editing = slide
      this.form = {
        displayId: slide.displayId,
        title: slide.title,
        type: slide.type,
        content: slide.content || '',
        duration: slide.duration,
        sortOrder: slide.sortOrder,
        transition: slide.transition || 'fade',
        enabled: slide.enabled,
        youtubeVideos: slide.youtubeVideos?.length
          ? slide.youtubeVideos.map((v) => v.url)
          : [''],
      }
      this.modalTitle = 'Edit Slide'
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
        const payload = { ...this.form }
        if (payload.type === 'youtube') {
          payload.youtubeVideos = payload.youtubeVideos
            .filter((u) => u.trim())
            .map((url) => ({ url }))
        } else {
          delete payload.youtubeVideos
        }
        if (this.editing) {
          await api.slides.update(this.editing.id, payload)
          showToast('Slide updated')
        } else {
          await api.slides.create(payload)
          showToast('Slide created')
        }
        this.closeModal()
        await this.load()
      } catch (e) {
        showToast(e.message, 'error')
      }
    },

    async confirmDelete(slide) {
      if (!confirm(`Delete "${slide.title}"?`)) return
      try {
        await api.slides.delete(slide.id)
        showToast('Slide deleted')
        await this.load()
      } catch (e) {
        showToast(e.message, 'error')
      }
    },

    async toggleEnabled(slide) {
      try {
        await api.slides.update(slide.id, { ...slide, enabled: !slide.enabled })
        slide.enabled = !slide.enabled
        showToast(`Slide ${slide.enabled ? 'enabled' : 'disabled'}`)
      } catch (e) {
        showToast(e.message, 'error')
      }
    },

    addYoutubeUrl() {
      this.form.youtubeVideos.push('')
    },

    removeYoutubeUrl(index) {
      this.form.youtubeVideos.splice(index, 1)
    },

    // Drag & drop
    dragStart(index) {
      this.dragIndex = index
    },

    dragOver(e, index) {
      e.preventDefault()
      if (this.dragIndex === index) return
      const item = this.slides.splice(this.dragIndex, 1)[0]
      this.slides.splice(index, 0, item)
      this.dragIndex = index
    },

    dragEnd() {
      this.dragIndex = null
      this.slides.forEach((s, i) => {
        api.slides.updateOrder(s.id, i).catch(() => {})
      })
    },

    prevPage() { if (this.page > 1) this.page-- },
    nextPage() { if (this.page < this.pages) this.page++ },
  }
}
