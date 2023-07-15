import App from './components/app/AppComponent.vue'
import { createApp } from 'vue'
import { usePrimeVue } from './plugins/primeVue'
import { useI18n } from './plugins/vueI18n'
import { useRouter } from './plugins/vueRouter'
import { useFontAwesome } from './plugins/fontAwesome'
import Item from './components/item/ItemComponent.vue'
import Price from './components/price/PriceComponent.vue'
import { configureServices } from './servicesConfiguration'

// Services
configureServices()

// App
const app = createApp(App)

// Plugins
useFontAwesome(app) // !!! PERFORMANCE ISSUE, MULTIPLIES BY 6 LOADING TIMES
useI18n(app)
usePrimeVue(app)
useRouter(app)

// Global components
app.component('Item', Item) // Need to be registered globally otherwise locally registering Item inside ItemContent which is registered inside Item doesn't work
app.component('Price', Price)

// Start
app.mount('#app')