import { createHead } from 'unhead'
import { createApp } from 'vue'
import App from './components/AppComponent.vue'
import { useApplicationInsights } from './plugins/applicationInsights'
import { useFontAwesome } from './plugins/fontAwesome'
import { usePrimeVue } from './plugins/primeVue'
import { useI18n } from './plugins/vueI18n'
import { useVueRouter } from './plugins/vueRouter'
import { polyfill } from './polyfill'
import { initializeServicesAsync } from './servicesConfiguration'

useApplicationInsights()

// Polyfill
polyfill()

// Services
void initializeServicesAsync()

// App
const app = createApp(App)

// Plugins
createHead()
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useVueRouter(app)

// Start
app.mount('#app')