import Alpine from 'alpinejs'
import { api } from '../shared/api.js'
import { formatTime, formatDateLong } from '../shared/utils.js'
import { SlideEngine } from './engine.js'

Alpine.data('player', () => ({
  display: null,
  slide: null,
  countdown: 0,
  countdownTotal: 0,
  currentTime: '',
  currentDate: '',
  engine: null,
  error: null,
  prayerTimes: [
    { name: 'Subuh', time: '04:30' },
    { name: 'Dzuhur', time: '12:15' },
    { name: 'Ashar', time: '15:30' },
    { name: 'Maghrib', time: '18:15' },
    { name: 'Isya', time: '19:45' },
  ],

  async init() {
    const slug = this.getSlugFromPath()
    if (!slug) {
      this.error = 'No display slug specified'
      return
    }

    try {
      const data = await api.display.getBySlug(slug)
      this.display = data.display
      if (!data.slides?.length) {
        this.error = 'No slides configured for this display'
        return
      }

      this.engine = new SlideEngine({
        slides: data.slides,
        onSlideChange: (slideData) => {
          this.slide = slideData
          this.$nextTick(() => this.renderCurrentSlide(slideData))
        },
      })

      this.engine.on((event) => {
        if (event.type === 'countdown') {
          this.countdown = event.countdown
          this.countdownTotal = event.total
        }
      })

      this.engine.start()
    } catch (e) {
      this.error = e.message
    }

    this.updateClock()
    setInterval(() => this.updateClock(), 1000)
  },

  getSlugFromPath() {
    const match = window.location.pathname.match(/\/display\/(.+)/)
    return match ? match[1] : null
  },

  updateClock() {
    const now = new Date()
    this.currentTime = formatTime(now)
    this.currentDate = formatDateLong(now)
  },

  async renderCurrentSlide(slideData) {
    const container = this.$refs.slideContainer
    if (!container) return
    const { renderSlide } = await import('./renderers.js')
    container.innerHTML = ''
    const el = renderSlide(slideData)
    container.appendChild(el)
  },

  destroy() {
    if (this.engine) this.engine.destroy()
  },
}))

window.Alpine = Alpine
Alpine.start()
