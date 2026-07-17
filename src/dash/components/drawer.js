export function drawerComponent() {
  return {
    open: false,
    title: '',
    onClose() {},
    openDrawer({ title } = {}) {
      this.title = title || ''
      this.open = true
    },
    closeDrawer() {
      this.open = false
      if (this.onClose) this.onClose()
    },
    handleBackdropClick(e) {
      if (e.target === e.currentTarget) this.closeDrawer()
    },
  }
}
