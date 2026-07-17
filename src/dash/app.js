import Alpine from 'alpinejs'
import { sidebarComponent } from './components/sidebar.js'
import { navbarComponent } from './components/navbar.js'
import { drawerComponent } from './components/drawer.js'
import { datatableComponent } from './components/datatable.js'
import { displaysPage } from './pages/displays.js'
import { slidesPage } from './pages/slides.js'
import { settingsPage } from './pages/settings.js'
import { getState, subscribe } from '../shared/store.js'

Alpine.data('sidebar', sidebarComponent)
Alpine.data('navbar', navbarComponent)
Alpine.data('drawer', drawerComponent)
Alpine.data('datatable', datatableComponent)
Alpine.data('displaysPage', displaysPage)
Alpine.data('slidesPage', slidesPage)
Alpine.data('settingsPage', settingsPage)

Alpine.data('dashboard', () => ({
  currentPage: 'displays',
  toast: null,
  init() {
    subscribe((state) => {
      this.toast = state.toast
    })
  },
  navigate({ detail }) {
    this.currentPage = detail.page
  },
}))

window.Alpine = Alpine
Alpine.start()
