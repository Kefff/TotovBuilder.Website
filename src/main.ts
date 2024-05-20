import { createApp } from 'vue'
import App from './components/AppComponent.vue'
import Item from './components/item/ItemComponent.vue'
import Price from './components/price/PriceComponent.vue'
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
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useRouter(app)

// Global components
app.component('Item', Item) // Needs to be registered globally otherwise locally registering Item inside ItemContent which is registered inside Item doesn't work
app.component('Price', Price)

// Start
app.mount('#app')