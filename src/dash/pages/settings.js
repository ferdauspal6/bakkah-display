export function settingsPage() {
  return {
    settings: {
      companyName: 'Bakkah',
      prayerApi: '',
      refreshInterval: 30,
    },
    saved: false,
    init() {
      const stored = localStorage.getItem('bakkah-settings')
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) }
      }
    },
    save() {
      localStorage.setItem('bakkah-settings', JSON.stringify(this.settings))
      this.saved = true
      setTimeout(() => { this.saved = false }, 2000)
    },
  }
}
