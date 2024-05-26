import { createApp } from 'vue'
import App from './components/AppComponent.vue'
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
useFontAwesome(app)
useI18n(app)
usePrimeVue(app)
useRouter(app)

// Global components to be able to call themselves
app.component('Item', Item)

// Start
app.mount('#app')