import { createHead } from 'unhead'
import { createApp } from 'vue'
import App from './components/AppComponent.vue'
import Tooltip from './components/TooltipComponent.vue'
import Item from './components/item/ItemComponent.vue'
import { useApplicationInsights } from './plugins/applicationInsights'
import { useFontAwesome } from './plugins/fontAwesome'
import { usePrimeVue } from './plugins/primeVue'
import { useI18n } from './plugins/vueI18n'
import { useRouter } from './plugins/vueRouter'
import { polyfill } from './polyfill'
import { configureServices } from './servicesConfiguration'

useApplicationInsights()

// Polyfill
polyfill()

// Services
configureServices()

// App
const app = createApp(App)

// Plugins
createHead()
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useRouter(app)

// Global components
app.component('Item', Item) // To be able to call itself
app.component('Tooltip', Tooltip) // To be able to call itself

// Start
app.mount('#app')