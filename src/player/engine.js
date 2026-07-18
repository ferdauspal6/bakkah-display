import { pickRandom, getYouTubeId } from '../shared/utils.js'

export class SlideEngine {
  constructor({ slides, container, onSlideChange }) {
    this.slides = slides
    this.container = container
    this.onSlideChange = onSlideChange
    this.currentIndex = 0
    this.timer = null
    this.countdown = 0
    this.running = false
    this.listeners = new Set()
  }

  on(event, fn) {
    const handler = typeof event === 'function' ? event : fn
    if (!handler) return () => {}
    this.listeners.add(handler)
    return () => this.listeners.delete(handler)
  }

  emit(data) {
    this.listeners.forEach((fn) => fn(data))
  }

  start() {
    if (!this.slides.length) return
    this.running = true
    this.showSlide(0)
  }

  stop() {
    this.running = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  showSlide(index) {
    if (!this.running || !this.slides.length) return
    this.currentIndex = index
    const slide = this.slides[index]

    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    const renderData = this.prepareRenderData(slide)
    this.onSlideChange(renderData)
    this.countdown = slide.duration
    this.emit({ type: 'countdown', countdown: this.countdown, total: slide.duration })

    this.timer = setInterval(() => {
      this.countdown--
      this.emit({ type: 'countdown', countdown: this.countdown, total: slide.duration })
      if (this.countdown <= 0) {
        this.next()
      }
    }, 1000)
  }

  prepareRenderData(slide) {
    const data = { ...slide }
    if (data.type === 'youtube' && data.youtubeVideos?.length) {
      const picked = pickRandom(data.youtubeVideos)
      data.selectedVideo = picked ? picked.url : null
      data.youtubeId = getYouTubeId(data.selectedVideo || '')
    }
    return data
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length
    this.showSlide(nextIndex)
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
    this.showSlide(prevIndex)
  }

  destroy() {
    this.stop()
    this.listeners.clear()
  }
}
