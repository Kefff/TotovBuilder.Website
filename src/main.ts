import { createHead } from 'unhead'
import { createApp, defineAsyncComponent } from 'vue'
import App from './components/AppComponent.vue'
import { useApplicationInsights } from './plugins/applicationInsights'
import { useFontAwesome } from './plugins/fontAwesome'
import { usePrimeVue } from './plugins/primeVue'
import { useI18n } from './plugins/vueI18n'
import { useRouter } from './plugins/vueRouter'
import { polyfill } from './polyfill'
import { initializeServices } from './servicesConfiguration'

useApplicationInsights()

// Polyfill
polyfill()

// Services
initializeServices()

// App
const app = createApp(App)

// Plugins
createHead()
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useRouter(app)

// Global components
app.component(
  'Item', // To be able to call itself
  defineAsyncComponent(() => import('./components/item/ItemComponent.vue')))
app.component(
  'Tooltip', // To be able to call itself
  defineAsyncComponent(() => import('./components/TooltipComponent.vue')))

// Start
app.mount('#app')