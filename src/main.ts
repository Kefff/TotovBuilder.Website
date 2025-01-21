import { createApp } from 'vue'
import App from './components/AppComponent.vue'
import { useApplicationInsights } from './plugins/applicationInsights'
import { useFloatingVue } from './plugins/floatingVue'
import { useFontAwesome } from './plugins/fontAwesome'
import { usePrimeVue } from './plugins/primeVue'
import { useUnhead } from './plugins/unhead'
import { useI18n } from './plugins/vueI18n'
import { useVueRouter } from './plugins/vueRouter'
import { polyfill } from './polyfill'
import { initializeServicesAsync } from './servicesConfiguration'

// Polyfill
polyfill()

// App
const app = createApp(App)

// Plugins
useApplicationInsights()
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useUnhead()
useFloatingVue(app)
useVueRouter(app)

// Start
app.mount('#app')

// Services
void initializeServicesAsync()