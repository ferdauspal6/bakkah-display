export function modalComponent() {
  return {
    open: false,
    title: '',
    size: 'md',
    onClose() {},
    openModal({ title, size = 'md' } = {}) {
      this.title = title || ''
      this.size = size
      this.open = true
    },
    closeModal() {
      this.open = false
      if (this.onClose) this.onClose()
    },
    handleBackdropClick(e) {
      if (e.target === e.currentTarget) this.closeModal()
    },
  }
}
