export function renderSlide(slide) {
  const container = document.createElement('div')
  container.className = 'slide-container fade-in'

  switch (slide.type) {
    case 'html':
      renderHtml(slide, container)
      break
    case 'iframe':
      renderIframe(slide, container)
      break
    case 'image':
      renderImage(slide, container)
      break
    case 'youtube':
      renderYoutube(slide, container)
      break
    default:
      container.innerHTML = '<p style="color:#6b7280;">Unsupported slide type</p>'
  }

  return container
}

function renderHtml(slide, container) {
  const div = document.createElement('div')
  div.className = 'html-content'
  div.innerHTML = slide.content || ''
  container.appendChild(div)
}

function renderIframe(slide, container) {
  const iframe = document.createElement('iframe')
  iframe.src = slide.content || ''
  iframe.allow = 'fullscreen'
  iframe.loading = 'lazy'
  const wrapper = document.createElement('div')
  wrapper.className = 'youtube-wrapper'
  wrapper.appendChild(iframe)
  container.appendChild(wrapper)
}

function renderImage(slide, container) {
  const img = document.createElement('img')
  img.src = slide.content || ''
  img.alt = slide.title
  img.loading = 'lazy'
  container.appendChild(img)
}

function renderYoutube(slide, container) {
  const wrapper = document.createElement('div')
  wrapper.className = 'youtube-wrapper'
  const iframe = document.createElement('iframe')
  if (slide.youtubeId) {
    iframe.src = `https://www.youtube.com/embed/${slide.youtubeId}?autoplay=1&mute=1&controls=0&rel=0`
  }
  iframe.allow = 'autoplay; fullscreen'
  wrapper.appendChild(iframe)
  container.appendChild(wrapper)
}
