import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import 'primevue/resources/primevue.min.css'
import Tooltip from 'primevue/tooltip'
import { App, defineAsyncComponent } from 'vue'
import '../css/theme.css'

export function usePrimeVue(app: App<Element>): void {
  app.use(PrimeVue)

  app.component('Button', defineAsyncComponent(() => import('primevue/button')))
  app.component('Card', defineAsyncComponent(() => import('primevue/card')))
  app.component('Checkbox', defineAsyncComponent(() => import('primevue/checkbox')))
  app.component('Chip', defineAsyncComponent(() => import('primevue/chip')))
  app.component('Column', defineAsyncComponent(() => import('primevue/column')))
  app.component('DataTable', defineAsyncComponent(() => import('primevue/datatable')))
  app.component('Dialog', defineAsyncComponent(() => import('primevue/dialog')))
  app.component('Dropdown', defineAsyncComponent(() => import('primevue/dropdown')))
  app.component('InputNumber', defineAsyncComponent(() => import('primevue/inputnumber')))
  app.component('InputText', defineAsyncComponent(() => import('primevue/inputtext')))
  app.component('Message', defineAsyncComponent(() => import('primevue/message')))
  app.component('OverlayPanel', defineAsyncComponent(() => import('primevue/overlaypanel')))
  app.component('Panel', defineAsyncComponent(() => import('primevue/panel')))
  app.component('Paginator', defineAsyncComponent(() => import('primevue/paginator')))
  app.component('Sidebar', defineAsyncComponent(() => import('primevue/sidebar')))
  app.component('TabPanel', defineAsyncComponent(() => import('primevue/tabpanel')))
  app.component('TabView', defineAsyncComponent(() => import('primevue/tabview')))
  app.component('TextArea', defineAsyncComponent(() => import('primevue/textarea')))
  app.component('VirtualScroller', defineAsyncComponent(() => import('primevue/virtualscroller')))

  app.directive('tooltip', Tooltip)
}